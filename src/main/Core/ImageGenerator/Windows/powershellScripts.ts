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

    # ExtractAssociatedIcon will crash if the file path contains special characters
    # e.g. "Über itunes" will crash the script and thus no search results are shown
    try {
        $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($InFilePath)
    
        if ($Icon -ne $null) {
            $Icon.ToBitmap().Save($OutFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
        }
    } catch {
        $Icon = $null
        "Error: " + $_.Exception.Message
    }
}`;
