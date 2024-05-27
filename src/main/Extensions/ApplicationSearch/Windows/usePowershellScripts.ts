const getWindowsAppsPowershellScript = `
    function Get-WindowsApps {
        param(
            [string[]]$FolderPaths,
            [string[]]$FileExtensions
        )

        Get-ChildItem -File -Path $FolderPaths -Recurse -Include $FileExtensions | Select-Object -Property Name, FullName, Extension, BaseName | ConvertTo-Json -Compress
    }`;

const getWindowsStoreApps = `
    $ErrorActionPreference = 'SilentlyContinue';
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;

    filter ArrayToHash
    {
        begin { $hash = @{} }
        process { $hash[$_.PackageFamilyName] = $_ }
        end { return $hash }
    }

    $currentStartApps = Get-StartApps | Where-Object { $_.AppID.Contains("!") };
    $currentStartAppIds = $currentStartApps | Select-Object -ExpandProperty AppID;
    $currentStartAppIdsSet = New-Object System.Collections.Generic.HashSet[string] (,[string[]]$currentStartAppIds);

    if ($currentStartApps.Count -eq 0) {
        return [PSCustomObject]@{
            NewApps = @();
        } | ConvertTo-Json
    }

    function FindLogoFilePath {
        param ([string]$logoFilePath)
        if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
            return $logoFilePath;
        }
        $filePath = Get-ChildItem $logoFilePath.Replace(".png", ".scale-*.png") |
            Sort-Object -Property Name |
            Select-Object -First 1 -ExpandProperty FullName;
        if ($filePath -ne $null) {
            $logoFilePath = $filePath;
        }
        if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
            return $logoFilePath;
        }
        $filePath = Get-ChildItem $logoFilePath.Replace(".png", ".targetsize-*.png") |
            Where-Object { ($_.Name -match "targetsize-(\\d+)\\.png") -and ($Matches[1] -ge 48) } |
            Sort-Object -Property Name |
            Select-Object -First 1 -ExpandProperty FullName;
        if ($filePath -ne $null) {
            $logoFilePath = $filePath;
        }
        if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
            return $logoFilePath;
        }
        $filePath = Get-ChildItem $logoFilePath.Replace(".png", ".targetsize-*.png") |
            Where-Object { ($_.Name -match "targetsize-(\\d+).*\\.png") -and ($Matches[1] -ge 48) } |
            Sort-Object -Property Name |
            Select-Object -First 1 -ExpandProperty FullName;
        if ($filePath -ne $null) {
            $logoFilePath = $filePath;
        }
        if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
            return $logoFilePath;
        } else {
            return $null;
        }
    }

    $packageFamilyNamesToPackages = Get-AppxPackage -PackageTypeFilter Main | ArrayToHash;
    $currentStartApps | ForEach-Object {
        $appId = $_.AppID.SubString($_.AppId.IndexOf("!") + 1);
        $packageFamilyName = $_.AppID.SubString(0, $_.AppId.IndexOf("!"));
        $package = $packageFamilyNamesToPackages[$packageFamilyName];
        $packageFullName = $package.PackageFullName;
        if ($packageFullName -ne $null) {
            $manifest = Get-AppxPackageManifest $packageFullName;
            $app = $manifest.Package.Applications.Application | Where-Object { $_.Id -eq $appId };
            $logo = $app.VisualElements.Square44x44Logo;
            if ($logo -eq $null) {
                $logo = $app.VisualElements.Square30x30Logo;
            }
            if ($logo -eq $null) {
                $logo = $app.VisualElements.Logo;
            }
            if ($logo -ne $null) {
                $logoFilePath = FindLogoFilePath (Join-Path $package.InstallLocation $logo);
                if ($logoFilePath -eq $null) {
                    Write-Host ("trying alternative location: " + (Join-Path $package.InstallLocation "images" $logo));
                    $logoFilePath = FindLogoFilePath ([IO.Path]::Combine($package.InstallLocation, "images", $logo));
                }
                if ($logoFilePath -ne $null) {
                    $logoBytes = Get-Content -Encoding Byte -Path $logoFilePath;
                    $logoBase64 = [Convert]::ToBase64String($logoBytes);
                } else {
                    $logoBase64 = "";
                }
            } else {
                $logoBase64 = "";
            }
            return [PSCustomObject]@{
                DisplayName = $_.Name;
                AppId = $_.AppID;
                LogoBase64 = $logoBase64;
            }
        }
    } | ConvertTo-Json -Compress;`;

export const usePowershellScripts = () => ({
    getWindowsAppsPowershellScript,
    getWindowsStoreApps,
});
