export const extractAssociatedFileIconPowershellScript = `
function Get-Shortcut-Target {
    param([string]$ShortcutFilePath)

    try {
        $Shell = New-Object -ComObject WScript.Shell
        $TargetPath = $Shell.CreateShortcut($ShortcutFilePath).TargetPath
        $TargetPathAccessible = Test-Path -Path $TargetPath -PathType Leaf
        if ($TargetPathAccessible) {
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

    Add-Type -AssemblyName System.Drawing

    if ($InFilePath.EndsWith(".lnk")) {
        $InFilePath = Get-Shortcut-Target -ShortcutFilePath $InFilePath
    }

    $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($InFilePath)

    if ($Icon -ne $null) {
        $Icon.ToBitmap().Save($OutFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
}`;
