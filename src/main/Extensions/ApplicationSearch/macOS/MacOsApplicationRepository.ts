import type { App } from "electron";
import { join, normalize, parse } from "path";
import type { CommandlineUtility } from "../../../CommandlineUtility";
import type { SettingsManager } from "../../../SettingsManager";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { MacOsApplicationIconGenerator } from "./MacOsApplicationIconGenerator";

export class MacOsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly app: App,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly macOsApplicationIconGenerator: MacOsApplicationIconGenerator,
        private readonly settingsManager: SettingsManager,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const filePaths = await this.getAllFilePaths();
        const icons = await this.getAllIcons(filePaths);

        return filePaths.map((filePath) => new Application(parse(filePath).name, filePath, icons[filePath]));
    }

    private async getAllFilePaths(): Promise<string[]> {
        return (await this.commandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) => this.filterFilePathByConfiguredFolders(filePath))
            .filter((filePath) => ![".", ".."].includes(filePath));
    }

    private filterFilePathByConfiguredFolders(filePath: string): boolean {
        return this.settingsManager
            .getExtensionSettingByKey<string[]>("ApplicationSearch", "folders", this.getDefaultFolders())
            .some((folderPath) => filePath.startsWith(folderPath));
    }

    private async getAllIcons(filePaths: string[]): Promise<Record<string, string>> {
        const result: Record<string, string> = {};

        const promiseResults = await Promise.allSettled(
            filePaths.map((filePath) => this.macOsApplicationIconGenerator.generateApplicationIcon(filePath)),
        );

        for (const promiseResult of promiseResults) {
            if (promiseResult.status === "fulfilled") {
                result[promiseResult.value.applicationFilePath] = promiseResult.value.iconFilePath;
            }
        }

        return result;
    }

    private getDefaultFolders(): string[] {
        return ["/System/Applications", "/Applications", join(this.app.getPath("home"), "Applications")];
    }
}
