<#
.SYNOPSIS
    Build Windows binaries, sign them via SignPath, and (optionally) publish a GitHub Release.

.DESCRIPTION
    Workaround for the broken GitHub Actions signing path. Runs locally:
      1. Builds Windows installers/portables with `bun run build:win`
      2. Zips the produced .exe files
      3. Submits the zip to SignPath via the Submit-SigningRequest PowerShell cmdlet
      4. Extracts the signed exes back over the unsigned ones
      5. Optionally creates/uploads a GitHub Release via the `gh` CLI

.PARAMETER ApiToken
    SignPath API token. Defaults to $env:SIGNPATH_API_TOKEN. Prompts if neither is set.

.PARAMETER OrganizationId
    SignPath organization UUID. Defaults to the project's hard-coded org ID.

.PARAMETER ProjectSlug
    SignPath project slug. Default: roblox-datastore-app

.PARAMETER SigningPolicySlug
    SignPath signing policy slug. Default: KELAS_MALAM

.PARAMETER Version
    Version to operate on. Defaults to the "version" field in package.json.

.PARAMETER SkipBuild
    Skip the `bun run build:win` step. Use the existing release/<version>/ output.

.PARAMETER CreateRelease
    Create a GitHub Release for tag v<Version> via `gh release create`.

.PARAMETER Draft
    When -CreateRelease is set, publish as a draft.

.EXAMPLE
    .\scripts\release-signed.ps1
    Builds, signs, leaves the signed exes in release\<version>\.

.EXAMPLE
    $env:SIGNPATH_API_TOKEN = "..."; .\scripts\release-signed.ps1 -CreateRelease
    Builds, signs, and publishes a GitHub Release.

.EXAMPLE
    .\scripts\release-signed.ps1 -SkipBuild
    Signs the existing build output without rebuilding.
#>

[CmdletBinding()]
param(
    [string]$ApiToken,
    [string]$OrganizationId = '8c2ccf2b-dfcd-4705-82a5-47205619cdd7',
    [string]$ProjectSlug = 'roblox-datastore-app',
    [string]$SigningPolicySlug = 'KELAS_MALAM',
    [string]$Version,
    [switch]$SkipBuild,
    [switch]$CreateRelease,
    [switch]$Draft
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

function Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Fail($msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

# --- Preflight ---------------------------------------------------------------

Step "Preflight checks"

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
    Fail "bun is not on PATH. Install from https://bun.sh"
}

if (-not (Get-Module -ListAvailable -Name SignPath)) {
    Fail "SignPath PowerShell module is not installed. Run: Install-Module -Name SignPath -Scope CurrentUser"
}

if ($CreateRelease -and -not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Fail "gh CLI is not on PATH. Install from https://cli.github.com"
}

if (-not $ApiToken) {
    $ApiToken = $env:SIGNPATH_API_TOKEN
}
if (-not $ApiToken) {
    $secure = Read-Host "Enter SignPath API token" -AsSecureString
    $ApiToken = [System.Net.NetworkCredential]::new('', $secure).Password
}
if (-not $ApiToken) {
    Fail "ApiToken is required (pass -ApiToken or set `$env:SIGNPATH_API_TOKEN)."
}

if (-not $Version) {
    $pkg = Get-Content (Join-Path $repoRoot 'package.json') -Raw | ConvertFrom-Json
    $Version = $pkg.version
}
if (-not $Version) {
    Fail "Could not determine version from package.json."
}
Write-Host "Version: $Version"

# --- Build -------------------------------------------------------------------

if (-not $SkipBuild) {
    Step "Building Windows binaries (bun run build:win)"
    & bun run build:win
    if ($LASTEXITCODE -ne 0) { Fail "bun run build:win failed (exit $LASTEXITCODE)." }
} else {
    Write-Host "Skipping build (-SkipBuild)"
}

$releaseDir = Join-Path $repoRoot "release\$Version"
if (-not (Test-Path $releaseDir)) {
    Fail "Expected output directory $releaseDir not found."
}

$exes = Get-ChildItem -Path $releaseDir -Filter '*.exe' -File
if ($exes.Count -eq 0) {
    Fail "No .exe files found in $releaseDir."
}
Write-Host "Found $($exes.Count) .exe file(s) to sign:"
$exes | ForEach-Object { Write-Host "  - $($_.Name)" }

# --- Zip ---------------------------------------------------------------------

Step "Packaging unsigned exes into zip"

$unsignedZip = Join-Path $repoRoot "release\$Version\_unsigned-bundle.zip"
$signedZip   = Join-Path $repoRoot "release\$Version\_signed-bundle.zip"
$extractDir  = Join-Path $repoRoot "release\$Version\_signed"

if (Test-Path $unsignedZip) { Remove-Item $unsignedZip -Force }
if (Test-Path $signedZip)   { Remove-Item $signedZip -Force }
if (Test-Path $extractDir)  { Remove-Item $extractDir -Recurse -Force }

Compress-Archive -Path ($exes.FullName) -DestinationPath $unsignedZip -Force
Write-Host "Created $unsignedZip ($([math]::Round((Get-Item $unsignedZip).Length / 1MB, 2)) MB)"

# --- Sign --------------------------------------------------------------------

Step "Submitting to SignPath ($SigningPolicySlug)"

Submit-SigningRequest `
    -InputArtifactPath $unsignedZip `
    -ApiToken $ApiToken `
    -OrganizationId $OrganizationId `
    -ProjectSlug $ProjectSlug `
    -SigningPolicySlug $SigningPolicySlug `
    -OutputArtifactPath $signedZip `
    -WaitForCompletion

if (-not (Test-Path $signedZip)) {
    Fail "Signed zip was not produced at $signedZip."
}
Write-Host "Received signed bundle at $signedZip"

# --- Replace unsigned with signed --------------------------------------------

Step "Replacing unsigned exes with signed versions"

Expand-Archive -Path $signedZip -DestinationPath $extractDir -Force

$signedExes = Get-ChildItem -Path $extractDir -Filter '*.exe' -File -Recurse
foreach ($signed in $signedExes) {
    $target = Join-Path $releaseDir $signed.Name
    Copy-Item -Path $signed.FullName -Destination $target -Force
    Write-Host "  + $($signed.Name)"
}

# Clean up temp files (keep them as audit trail by default — comment out to remove)
Remove-Item $unsignedZip -Force
Remove-Item $signedZip -Force
Remove-Item $extractDir -Recurse -Force

# --- Optional: GitHub Release ------------------------------------------------

if ($CreateRelease) {
    Step "Creating GitHub Release v$Version"

    $tag = "v$Version"
    $existing = & gh release view $tag 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Release $tag already exists. Uploading signed files (overwriting)..."
        & gh release upload $tag $exes.FullName --clobber
    } else {
        $args = @('release', 'create', $tag,
                  '--title', "Release $tag",
                  '--generate-notes')
        if ($Draft) { $args += '--draft' }
        $args += $exes.FullName
        & gh @args
    }
    if ($LASTEXITCODE -ne 0) { Fail "gh release command failed (exit $LASTEXITCODE)." }
}

Step "Done"
Write-Host "Signed binaries:" -ForegroundColor Green
$exes | ForEach-Object { Write-Host "  $($_.FullName)" }
