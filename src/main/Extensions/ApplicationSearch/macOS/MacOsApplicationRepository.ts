import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Logger } from "@Core/Logger";
import { normalize, parse } from "path";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import type { MacOsApplicationIconGenerator } from "./MacOsApplicationIconGenerator";

export class MacOsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly macOsApplicationIconGenerator: MacOsApplicationIconGenerator,
        private readonly logger: Logger,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const filePaths = await this.getAllFilePaths();
        const icons = await this.getAllIcons(filePaths);

        return filePaths
            .filter((filePath) => !!icons[filePath])
            .map((filePath) => new Application(parse(filePath).name, filePath, icons[filePath]));
    }

    private async getAllFilePaths(): Promise<string[]> {
        return (await this.commandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) => filePath.endsWith(".app"))
            .filter((filePath) => this.filterFilePathByConfiguredFolders(filePath))
            .filter((filePath) => ![".", ".."].includes(filePath));
    }

    private filterFilePathByConfiguredFolders(filePath: string): boolean {
        return this.settings.getValue<string[]>("macOsFolders").some((folderPath) => filePath.startsWith(folderPath));
    }

    private async getAllIcons(filePaths: string[]): Promise<Record<string, string>> {
        const result: Record<string, string> = {};

        const promiseResults = await Promise.allSettled(
            filePaths.map((filePath) => this.macOsApplicationIconGenerator.generateApplicationIcon(filePath)),
        );

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const promiseResult = promiseResults[i];

            if (promiseResult.status === "fulfilled") {
                result[filePath] = promiseResult.value.iconFilePath;
            } else {
                this.logger.error(`Failed to generate icon for '${filePath}. Reason: ${promiseResult.reason}'`);
            }
        }

        return result;
    }
}
