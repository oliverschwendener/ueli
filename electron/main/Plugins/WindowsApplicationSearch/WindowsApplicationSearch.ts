import { join } from "path";
import { SearchIndex } from "../../SearchIndex";
import { PowershellUtility } from "../../Utilities";
import { Plugin } from "../Plugin";
import { Application } from "./Application";
import { extractShortcutPowershellScript, getWindowsAppsPowershellScript } from "./PowershellScripts";
import { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { Settings } from "./Settings";
import { SettingsManager } from "../../Settings/SettingsManager";
import { PluginDependencies } from "../PluginDependencies";

export class WindowsApplicationSearch implements Plugin {
    private static readonly pluginId = "WindowsApplicationSearch";

    private readonly searchIndex: SearchIndex;
    private readonly settingsManager: SettingsManager;
    private readonly pluginCacheFolderPath: string;
    private readonly defaultSettings: Settings;

    public constructor({ app, pluginCacheFolderPath, searchIndex, settingsManager }: PluginDependencies) {
        this.searchIndex = searchIndex;
        this.settingsManager = settingsManager;
        this.pluginCacheFolderPath = pluginCacheFolderPath;

        this.defaultSettings = {
            folders: [
                "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
                join(app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
            ],
            fileExtensions: ["lnk"],
        };
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>(
            JSON.parse(await PowershellUtility.executePowershellScript(this.getPowershellScript()))
        );

        this.searchIndex.addSearchResultItems(
            WindowsApplicationSearch.pluginId,
            windowsApplicationRetrieverResults
                .map((result) => Application.fromFilePath(result))
                .map((application) => application.toSearchResultItem()),
        );
    }

    private getPowershellScript(): string {
        const folderPaths = WindowsApplicationSearch.getFolderPathFilter(
            this.settingsManager.getSettingByKey<string[]>(
                `plugin[${WindowsApplicationSearch.pluginId}].folders`,
                this.defaultSettings.folders,
            ),
        );

        const fileExtensions = WindowsApplicationSearch.getFileExtensionFilter(
            this.settingsManager.getSettingByKey<string[]>(
                `plugin[${WindowsApplicationSearch.pluginId}].fileExtensions`,
                this.defaultSettings.fileExtensions,
            ),
        );

        return `
            ${extractShortcutPowershellScript}
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${folderPaths} -FileExtensions ${fileExtensions} -AppIconFolder '${this.pluginCacheFolderPath}';
        `;
    }

    private static getFolderPathFilter(folderPaths: string[]): string {
        return folderPaths.map((folderPath) => `'${folderPath}'`).join(",");
    }

    private static getFileExtensionFilter(fileExtensions: string[]): string {
        return fileExtensions.map((fileExtension) => `'*.${fileExtension}'`).join(",");
    }
}
