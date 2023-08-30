import { join } from "path";
import type { SearchIndex } from "../../SearchIndex";
import type { SettingsManager } from "../../Settings/SettingsManager";
import type { CommandlineUtility, FileSystemUtility } from "../../Utilities";
import type { Plugin } from "../Plugin";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";
import type { Settings } from "./Settings";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationSearch implements Plugin {
    private static readonly PluginId = "WindowsApplicationSearch";

    private readonly commandlineUtility: CommandlineUtility;
    private readonly defaultSettings: Settings;
    private readonly fileSystemUtility: FileSystemUtility;
    private readonly pluginCacheFolderPath: string;
    private readonly searchIndex: SearchIndex;
    private readonly settingsManager: SettingsManager;

    public constructor({
        app,
        commandlineUtility,
        fileSystemUtility,
        pluginCacheFolderPath,
        searchIndex,
        settingsManager,
    }: PluginDependencies) {
        this.commandlineUtility = commandlineUtility;
        this.fileSystemUtility = fileSystemUtility;
        this.pluginCacheFolderPath = pluginCacheFolderPath;
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
        const temporaryPowershellScriptFilePath = join(this.pluginCacheFolderPath, "WindowsApplicationSearch.temp.ps1");

        await this.fileSystemUtility.writeTextFile(this.getPowershellScript(), temporaryPowershellScriptFilePath);

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>(
            JSON.parse(
                await this.commandlineUtility.executeCommandWithOutput(
                    `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${temporaryPowershellScriptFilePath}"`,
                ),
            )
        );

        this.searchIndex.addSearchResultItems(
            WindowsApplicationSearch.PluginId,
            windowsApplicationRetrieverResults
                .map((result) => Application.fromFilePath(result))
                .map((application) => application.toSearchResultItem()),
        );

        await this.fileSystemUtility.removeFile(temporaryPowershellScriptFilePath);
    }

    private getPowershellScript(): string {
        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

        const folderPaths = this.settingsManager
            .getPluginSettingByKey(WindowsApplicationSearch.PluginId, "folders", this.defaultSettings.folders)
            .map((folderPath) => `'${folderPath}'`)
            .join(",");

        const fileExtensions = this.settingsManager
            .getPluginSettingByKey(
                WindowsApplicationSearch.PluginId,
                "fileExtensions",
                this.defaultSettings.fileExtensions,
            )
            .map((fileExtension) => `'*.${fileExtension}'`)
            .join(",");

        return `
${extractShortcutPowershellScript}
${getWindowsAppsPowershellScript}

Get-WindowsApps -FolderPaths ${folderPaths} -FileExtensions ${fileExtensions} -AppIconFolder '${this.pluginCacheFolderPath}';`;
    }
}
