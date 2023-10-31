import type { SettingsManager as SettingsManagerInterface } from "@common/SettingsManager";
import type { SettingsReader } from "@common/SettingsReader";
import type { SettingsWriter } from "@common/SettingsWriter";
import { SettingsManager } from "./SettingsManager";

export const useSettingsManager = ({
    settingsReader,
    settingsWriter,
}: {
    settingsReader: SettingsReader;
    settingsWriter: SettingsWriter;
}): SettingsManagerInterface => new SettingsManager(settingsReader, settingsWriter);
