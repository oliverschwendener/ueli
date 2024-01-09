import type { Settings } from "../../Settings";

export interface SettingsReader {
    readSettings(): Settings;
}
