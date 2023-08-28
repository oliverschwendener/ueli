const extractShortcutPowershellScript = `
function Extract-Shortcut {
    param(
        [string]$ShortcutFilePath
    )

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
}`;

const getWindowsAppsPowershellScript = `
function Get-WindowsApps {
    param(
        [string[]]$FolderPaths,
        [string[]]$FileExtensions,
        [string]$AppIconFolder
    )

    Add-Type -AssemblyName System.Drawing

    $Utf8 = New-Object -TypeName System.Text.UTF8Encoding

    $Files = Get-ChildItem -File -Path $FolderPaths -Recurse -Include $FileExtensions | Select-Object -Property Name, FullName, Extension, BaseName

    foreach ($File in $Files) {
        $Hash = [convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($File.FullName))
        $IconFilePath = "$($AppIconFolder)\\$($Hash).png"
        $File | Add-Member -MemberType NoteProperty -Name "IconFilePath" -Value $IconFilePath

        $IconAlreadyExists = Test-Path -LiteralPath $File.IconFilePath

        if (!$IconAlreadyExists) {
            $FilePathToExtractIcon = $File.FullName

            if ($File.Extension -eq ".lnk") {
                $FilePathToExtractIcon = Extract-Shortcut -ShortcutFilePath $File.FullName
            }

            $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($FilePathToExtractIcon)

            if ($Icon -ne $null) {
                $Icon.ToBitmap().Save($File.IconFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
            }
        }
    }

    $Files | ConvertTo-Json -Compress
}`;

export const usePowershellScripts = () => {
    return {
        extractShortcutPowershellScript,
        getWindowsAppsPowershellScript,
    };
};
