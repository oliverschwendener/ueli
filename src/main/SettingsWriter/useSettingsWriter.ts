import type { SettingsWriter } from "@common/SettingsWriter";
import { SettingsFileWriter } from "./SettingsFileWriter";

export const useSettingsWriter = (settingsFilePath: string): SettingsWriter => new SettingsFileWriter(settingsFilePath);
