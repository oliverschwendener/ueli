export const extractAssociatedFileIconPowershellScript = `
function Get-Shortcut-Target {
    param([string]$ShortcutFilePath)

    try {
        $Shell = New-Object -ComObject WScript.Shell
        $Shortcut = $Shell.CreateShortcut($ShortcutFilePath)
        $TargetPath = $Shortcut.TargetPath
        $IconLocation = $Shortcut.IconLocation

        $lastComma = $IconLocation.LastIndexOf(",")
        if ($lastComma -gt -1) {
            $IconPath = $IconLocation.Substring(0, $lastComma).Trim()
            $IconId = [int]($IconLocation.Substring($lastComma + 1).Trim())
        }
        else {
            $IconPath = $IconLocation.Trim()
            $IconId = 0
        }

        if ($IconPath -and (Test-Path -Path $IconPath -PathType Leaf)) {
            return $IconPath
        }
        if (Test-Path -Path $TargetPath -PathType Leaf) {
            return $TargetPath
        }
        else {
            return $ShortcutFilePath
        }
    }
    catch {
        return $ShortcutFilePath
    }
}

function Get-Associated-Icon {
    param(
        [string]$InFilePath,
        [string]$OutFilePath
    )

    $ErrorActionPreference = "SilentlyContinue"
    Add-Type -AssemblyName System.Drawing

    if ($InFilePath.EndsWith(".lnk")) {
        $InFilePath = Get-Shortcut-Target -ShortcutFilePath $InFilePath
    }

    $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($InFilePath)

    if ($null -ne $Icon) {
        $Icon.ToBitmap().Save($OutFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
}`;
