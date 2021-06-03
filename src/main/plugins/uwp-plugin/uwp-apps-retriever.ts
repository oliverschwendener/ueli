import { UwpApplication } from "./uwp-application";
import { spawnPowershellCommandWithOutput } from "../../executors/command-executor";
import { IconType } from "../../../common/icon/icon-type";

export function getAllUwpApps(alreadyKnownApps: UwpApplication[]): Promise<UwpApplication[]> {
    return new Promise((resolve, reject) => {
        const alreadyKnownAppIds =
            alreadyKnownApps.length === 0 ? "@()" : alreadyKnownApps.map((a) => `"${a.appId}"`).join(",");
        const command = getUwpAppsCommand.replace(/\n/g, " ").replace("%alreadyKnownAppIds%", alreadyKnownAppIds);

        spawnPowershellCommandWithOutput(command)
            .then((resultString) => {
                const result = JSON.parse(resultString) as { NewApps: any[]; RemovedAppIds: string[] };
                const allCurrentApps = alreadyKnownApps
                    .filter(
                        (alreadyKnownApp) =>
                            !result.RemovedAppIds || !result.RemovedAppIds.includes(alreadyKnownApp.appId),
                    )
                    .concat(result.NewApps.map(convertNewAppToUwpApplication));
                resolve(allCurrentApps);
            })
            .catch((error) => reject(error));
    });
}

const getUwpAppsCommand = `
$ErrorActionPreference = 'SilentlyContinue';
[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8;

filter ArrayToHash
{
    begin { $hash = @{} }
    process { $hash[$_.PackageFamilyName] = $_ }
    end { return $hash }
}

[string[]]$alreadyKnownAppIds = %alreadyKnownAppIds%;
$alreadyKnownAppIdsSet = New-Object System.Collections.Generic.HashSet[string] (,$alreadyKnownAppIds);

$currentStartApps = Get-StartApps | Where-Object { $_.AppID.Contains("!") };
$currentStartAppIds = $currentStartApps | Select-Object -ExpandProperty AppID;
$currentStartAppIdsSet = New-Object System.Collections.Generic.HashSet[string] (,[string[]]$currentStartAppIds);
$newStartApps = $currentStartApps | Where-Object { -not $alreadyKnownAppIdsSet.Contains($_.AppID) };
$newStartAppIds = $newStartApps | Select-Object -ExpandProperty AppID;
$newStartAppIdsSet = New-Object System.Collections.Generic.HashSet[string] (,[string[]]$newStartAppIds);
$removedAppIds = $alreadyKnownAppIds | Where-Object { -not $currentStartAppIdsSet.Contains($_) };
if ($newStartApps.Count -eq 0) {
    return [PSCustomObject]@{
        NewApps = @();
        RemovedAppIds = @($removedAppIds);
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
$newApps = $newStartApps |
    ForEach-Object {
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
    };
return [PSCustomObject]@{
    NewApps = @($newApps);
    RemovedAppIds = @($removedAppIds);
} | ConvertTo-Json`;

function convertNewAppToUwpApplication(newApp: {
    AppId: string;
    DisplayName: string;
    LogoBase64: string;
}): UwpApplication {
    return {
        appId: newApp.AppId,
        icon: {
            parameter: `data:image/png;base64,${newApp.LogoBase64}`,
            type: IconType.URL,
        },
        name: newApp.DisplayName,
    };
}
