import type { Logger } from "@Core/Logger";
import type { SettingsFilePathSource } from "./SettingsFilePathSource";

export class SettingsFilePathResolver {
    public constructor(
        private readonly sources: SettingsFilePathSource[],
        private readonly logger: Logger,
    ) {}

    public resolve(): string {
        for (const source of this.sources) {
            const settingsFilePath = source.getSettingsFilePath();

            if (settingsFilePath) {
                this.logger.info(`Reading settings from "${settingsFilePath}"`);
                return settingsFilePath;
            }
        }

        throw new Error("Could not resolve settings file path");
    }
}
