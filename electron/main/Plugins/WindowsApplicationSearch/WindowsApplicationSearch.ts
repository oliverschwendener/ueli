import { join } from "path";
import { PowershellUtility } from "../../Utilities/PowershellUtility";
import { Plugin } from "../Plugin";
import { extractShortcutPowershellScript, getWindowsAppsPowershellScript } from "./PowershellScripts";
import { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { SearchIndex } from "../../SearchIndex";
import { Application } from "./Application";

export class WindowsApplicationSearch implements Plugin {
    public constructor(
        private readonly searchIndex: SearchIndex,
        private readonly userHomePath: string,
        private readonly pluginCacheFolderPath: string,
    ) {}

    public getId(): string {
        return "WindowsApplicationSearch";
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>(
            JSON.parse(await PowershellUtility.executePowershellScript(this.getPowershellScript()))
        );

        this.searchIndex.addSearchResultItems(
            this.getId(),
            windowsApplicationRetrieverResults
                .map((result) => Application.fromFilePath(result))
                .map((application) => application.toSearchResultItem()),
        );
    }

    private getPowershellScript(): string {
        const folderPaths = WindowsApplicationSearch.getFolderPathFilter([
            "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
            join(this.userHomePath, "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
        ]);

        const fileExtensions = WindowsApplicationSearch.getFileExtensionFilter(["lnk"]);

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
