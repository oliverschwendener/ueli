import { Settings } from "@common/Settings";

export interface SettingsWriter {
    writeSettings(settings: Settings): Promise<void>;
}
