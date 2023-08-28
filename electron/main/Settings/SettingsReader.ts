import type { Settings } from "@common/Settings";

export interface SettingsReader {
    readSettings(): Settings;
}
