import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import { getExtensionSettingKey } from "@common/Core/Extension";
import { normalize } from "path";
import type { FileSearcher } from "../FileSearcher";

export class EverythingFileSearcher implements FileSearcher {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly settingsManager: SettingsManager,
        private readonly logger: Logger,
    ) {}

    public async getFilePathsBySearchTerm(searchTerm: string, maxSearchResultCount: number): Promise<string[]> {
        const everythingCliFilePath = this.settingsManager.getValue(
            getExtensionSettingKey("FileSearch", "everythingCliFilePath"),
            "",
        );

        if (!everythingCliFilePath) {
            this.logger.error("Everything CLI file path not set");
            return [];
        }

        const stdout = await this.commandlineUtility.executeCommand(
            `cmd /c chcp 65001>nul && "${everythingCliFilePath}" -max-results ${maxSearchResultCount} ${searchTerm}`,
        );

        return stdout
            .split("\n")
            .map((line) => normalize(line).trim())
            .filter((f) => f !== ".");
    }
}
