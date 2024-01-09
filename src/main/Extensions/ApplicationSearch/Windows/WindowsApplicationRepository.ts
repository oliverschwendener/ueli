import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { join } from "path";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly extensionCacheFolder: ExtensionCacheFolder,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const stdout = await this.executeTemporaryPowershellScriptWithOutput(
            this.getPowershellScript(),
            join(this.extensionCacheFolder.path, "WindowsApplicationSearch.temp.ps1"),
        );

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);

        return windowsApplicationRetrieverResults.map(
            ({ BaseName, FullName, IconFilePath }) => new Application(BaseName, FullName, IconFilePath),
        );
    }

    private async executeTemporaryPowershellScriptWithOutput(script: string, filePath: string): Promise<string> {
        await this.fileSystemUtility.writeTextFile(script, filePath);

        const stdout = await this.commandlineUtility.executeCommandWithOutput(
            `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${filePath}"`,
        );

        await this.fileSystemUtility.removeFile(filePath);

        return stdout;
    }

    private getPowershellScript(): string {
        const folderPaths = this.settings
            .getValue<string[]>("windowsFolders")
            .map((folderPath) => `'${folderPath}'`)
            .join(",");

        const fileExtensions = this.settings
            .getValue<string[]>("windowsFileExtensions")
            .map((fileExtension) => `'*.${fileExtension}'`)
            .join(",");

        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

        return `
            ${extractShortcutPowershellScript}
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${folderPaths} -FileExtensions ${fileExtensions} -AppIconFolder '${this.extensionCacheFolder.path}';`;
    }
}
