import type { SettingsFilePathSource } from "./SettingsFilePathSource";

export class SettingsFilePathResolver {
    public constructor(private readonly sources: SettingsFilePathSource[]) {}

    public resolve(): string {
        for (const source of this.sources) {
            const settingsFilePath = source.getSettingsFilePath();

            if (settingsFilePath) {
                return settingsFilePath;
            }
        }

        throw new Error("Could not resolve settings file path");
    }
}
