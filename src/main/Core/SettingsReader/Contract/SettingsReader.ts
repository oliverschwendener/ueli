import type { Settings } from "../../Settings";

export interface SettingsReader {
    readSettings(): Settings;
    readSettingsFromPath(filePath: string): Settings;
}
