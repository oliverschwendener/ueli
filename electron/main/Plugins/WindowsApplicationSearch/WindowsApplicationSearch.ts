import { join } from "path";
import type { SearchIndex } from "../../SearchIndex";
import type { SettingsManager } from "../../Settings/SettingsManager";
import type { PowershellUtility } from "../../Utilities";
import type { Plugin } from "../Plugin";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";
import type { Settings } from "./Settings";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationSearch implements Plugin {
    private static readonly PluginId = "WindowsApplicationSearch";

    private readonly defaultSettings: Settings;
    private readonly pluginCacheFolderPath: string;
    private readonly powershellUtility: PowershellUtility;
    private readonly searchIndex: SearchIndex;
    private readonly settingsManager: SettingsManager;

    public constructor({
        app,
        pluginCacheFolderPath,
        powershellUtility,
        searchIndex,
        settingsManager,
    }: PluginDependencies) {
        this.pluginCacheFolderPath = pluginCacheFolderPath;
        this.powershellUtility = powershellUtility;
        this.searchIndex = searchIndex;
        this.settingsManager = settingsManager;

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
            JSON.parse(await this.powershellUtility.executePowershellScript(this.getPowershellScript()))
        );

        this.searchIndex.addSearchResultItems(
            WindowsApplicationSearch.PluginId,
            windowsApplicationRetrieverResults
                .map((result) => Application.fromFilePath(result))
                .map((application) => application.toSearchResultItem()),
        );
    }

    private getPowershellScript(): string {
        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

        const folderPaths = WindowsApplicationSearch.getFolderPathFilter(
            this.settingsManager.getPluginSettingByKey<string[]>(
                WindowsApplicationSearch.PluginId,
                "folders",
                this.defaultSettings.folders,
            ),
        );

        const fileExtensions = WindowsApplicationSearch.getFileExtensionFilter(
            this.settingsManager.getPluginSettingByKey<string[]>(
                WindowsApplicationSearch.PluginId,
                "fileExtensions",
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
