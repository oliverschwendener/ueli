import type { Settings } from "../../Settings";

export interface SettingsWriter {
    writeSettings(settings: Settings): Promise<void>;
    writeSettingsToPath(settings: Settings, filePath: string): Promise<void>;
}
