import type { OperatingSystem } from "@common/OperatingSystem";
import { join } from "path";
import type { Plugin } from "../Plugin";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationSearch implements Plugin {
    private static readonly PluginId = "WindowsApplicationSearch";

    public constructor(private readonly pluginDependencies: PluginDependencies) {}

    public getSupportedOperatingSystems(): OperatingSystem[] {
        return ["Windows"];
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const { pluginCacheFolderPath, fileSystemUtility, commandlineUtility, searchIndex } = this.pluginDependencies;

        const temporaryPowershellScriptFilePath = join(pluginCacheFolderPath, "WindowsApplicationSearch.temp.ps1");

        await fileSystemUtility.writeTextFile(this.getPowershellScript(), temporaryPowershellScriptFilePath);

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>(
            JSON.parse(
                await commandlineUtility.executeCommandWithOutput(
                    `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${temporaryPowershellScriptFilePath}"`,
                ),
            )
        );

        searchIndex.addSearchResultItems(
            WindowsApplicationSearch.PluginId,
            windowsApplicationRetrieverResults
                .map((result) => Application.fromWindowsApplicationRetrieverResult(result))
                .map((application) => application.toSearchResultItem()),
        );

        await fileSystemUtility.removeFile(temporaryPowershellScriptFilePath);
    }

    private getPowershellScript(): string {
        const { pluginCacheFolderPath, settingsManager } = this.pluginDependencies;
        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

        const folderPaths = settingsManager
            .getPluginSettingByKey(WindowsApplicationSearch.PluginId, "folders", this.getDefaultFolderPaths())
            .map((folderPath) => `'${folderPath}'`)
            .join(",");

        const fileExtensions = settingsManager
            .getPluginSettingByKey(WindowsApplicationSearch.PluginId, "fileExtensions", this.getDefaultFileExtensions())
            .map((fileExtension) => `'*.${fileExtension}'`)
            .join(",");

        return `
            ${extractShortcutPowershellScript}
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${folderPaths} -FileExtensions ${fileExtensions} -AppIconFolder '${pluginCacheFolderPath}';`;
    }

    private getDefaultFolderPaths(): string[] {
        const { app } = this.pluginDependencies;

        return [
            "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
            join(app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
        ];
    }

    private getDefaultFileExtensions(): string[] {
        return ["lnk"];
    }
}
