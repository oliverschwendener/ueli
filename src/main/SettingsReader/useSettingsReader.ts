import type { SettingsReader } from "@common/SettingsReader";
import { SettingsFileReader } from "./SettingsFileReader";

export const useSettingsReader = (settingsFilePath: string): SettingsReader => new SettingsFileReader(settingsFilePath);
