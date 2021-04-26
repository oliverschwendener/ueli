import { executeCommandWithOutput } from "../../executors/command-executor";
import { ControlPanelItem } from "./control-panel-item";
import Powershell from "node-powershell";

export class ControlPanelItemsRetriever {
    public static RetrieveControlPanelItems(alreadyKnownItems: ControlPanelItem[]): Promise<ControlPanelItem[]> {
        return new Promise((resolve, reject) => {
            this.executeCommandWithUtf8Output(
                'powershell -NonInteractive -NoProfile -Command "Get-ControlPanelItem | ConvertTo-Json"',
            )
                .then((controlPanelItemsJson) => {
                    const controlPanelItems: ControlPanelItem[] = JSON.parse(controlPanelItemsJson);

                    const alreadyKnownItemsStillPresent = alreadyKnownItems.filter((item) =>
                        controlPanelItems.some((i) => i.Name === item.Name),
                    );
                    const newControlPanelItems = controlPanelItems.filter(
                        (item) => !alreadyKnownItems.some((i) => i.Name === item.Name),
                    );

                    const iconSize = 128;
                    const getIconsCommand = `
            $iconExtractorCode = '${this.iconExtractorCode}';
            $iconExtractorType = Add-Type -TypeDefinition $iconExtractorCode -PassThru -ReferencedAssemblies 'System.Drawing.dll';
            $ErrorActionPreference = "SilentlyContinue";

            Get-Item -Path "Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\ControlPanel\\NameSpace\\*" |
                Select-Object -ExpandProperty Name |
                ForEach-Object {
                    if ($_.substring($_.lastindexof("\\") + 1) -match "{.+}") { return $Matches[0] }
                    else { return $null }
                } |
                Where-Object { $_ -ne $null } |
                ForEach-Object {
                    $defaultIconValue = Get-ItemProperty -Path "Registry::HKEY_CLASSES_ROOT\\CLSID\\$_\\DefaultIcon" | Select-Object -ExpandProperty "(default)";
                    $defaultIconValueSplit = $defaultIconValue.Split(',');
                    $iconPath = $defaultIconValueSplit[0];
                    $iconIndex = if ($defaultIconValueSplit.Length -gt 1) { $defaultIconValueSplit[1] } else { $null };
                    $iconBase64 = $iconExtractorType[0]::GetIconAsBase64($iconPath, ${iconSize}, $iconIndex);
                    @{
                        applicationName = Get-ItemProperty -Path "Registry::HKEY_CLASSES_ROOT\\CLSID\\$_" | Select-Object -ExpandProperty "System.ApplicationName";
                        iconBase64 = $iconBase64;
                    };
                } |
                ConvertTo-Json
                    `;
                    const shell = new Powershell({ noProfile: true });
                    shell
                        .addCommand(getIconsCommand)
                        .then(() => shell.invoke())
                        .then((controlPanelItemIconsJson) => {
                            const controlPanelItemIcons: { applicationName: string; iconBase64: string }[] = JSON.parse(
                                controlPanelItemIconsJson,
                            );
                            for (const icon of controlPanelItemIcons) {
                                const item = newControlPanelItems.find((i) => i.CanonicalName === icon.applicationName);
                                if (item != null && icon.iconBase64 != null) {
                                    item.IconBase64 = icon.iconBase64;
                                }
                            }
                            resolve(alreadyKnownItemsStillPresent.concat(newControlPanelItems));
                        })
                        .finally(() => shell.dispose())
                        .catch((reason) => reject(reason));
                })
                .catch((reason) => reject(reason));
        });
    }

    private static readonly iconExtractorCode = `
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

namespace IconExtractor
{
    public class IconExtractor
    {
        private const uint GroupIcon = 14;
        private const uint LoadLibraryAsDatafile = 0x00000002;

        private delegate bool EnumResNameDelegate(IntPtr hModule, IntPtr lpszType, IntPtr lpszName, IntPtr lParam);

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern IntPtr LoadLibraryEx(string lpFileName, IntPtr hFile, uint dwFlags);

        [DllImport("kernel32.dll", EntryPoint = "EnumResourceNamesW", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern bool EnumResourceNamesWithId(IntPtr hModule, uint lpszType, EnumResNameDelegate lpEnumFunc, IntPtr lParam);

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool FreeLibrary(IntPtr hModule);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        static extern IntPtr LoadImage(IntPtr hinst, IntPtr lpszName, uint uType, int cxDesired, int cyDesired, uint fuLoad);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        static extern bool DestroyIcon(IntPtr handle);

        public static string GetIconAsBase64(string filePath, int iconSize, string iconIndex = null)
        {
            var iconPointer = GetIconPointer(filePath, iconSize, iconIndex);
            if (iconPointer != IntPtr.Zero)
            {
                var icon = Icon.FromHandle(iconPointer);
                var bitmap = icon.ToBitmap();
                DestroyIcon(iconPointer);
                using (var stream = new MemoryStream())
                {
                    bitmap.Save(stream, ImageFormat.Png);
                    var base64String = Convert.ToBase64String(stream.ToArray());
                    return base64String;
                }
            }
            return null;
        }

        private static IntPtr GetIconPointer(string filePath, int iconSize, string iconIndex = null)
        {
            var dataFilePointer = LoadLibraryEx(filePath, IntPtr.Zero, LoadLibraryAsDatafile);
            if (dataFilePointer == IntPtr.Zero)
                return IntPtr.Zero;
            var iconIndexPointer = iconIndex != null
                                        ? new IntPtr(Math.Abs(Convert.ToInt32(iconIndex)))
                                        : IntPtr.Zero;
            var iconPointer = LoadImage(dataFilePointer, iconIndexPointer, 1, iconSize, iconSize, 0);
            if (iconPointer == IntPtr.Zero)
            {
                EnumResourceNamesWithId(dataFilePointer, GroupIcon, (hModule, lpszType, lpszName, lParam) =>
                {
                    iconPointer = lpszName;
                    return false;
                }, IntPtr.Zero);
                iconPointer = LoadImage(dataFilePointer, iconPointer, 1, iconSize, iconSize, 0);
            }
            FreeLibrary(dataFilePointer);
            return iconPointer;
        }
    }
}
    `;

    private static executeCommandWithUtf8Output(command: string): Promise<string> {
        return executeCommandWithOutput(`cmd /c chcp 65001>nul && ${command}`);
    }
}
