import type { DependencyInjector } from "@common/DependencyInjector";
import type { SettingsManager as SettingsManagerInterface } from "@common/SettingsManager";
import type { SettingsReader } from "@common/SettingsReader";
import type { SettingsWriter } from "@common/SettingsWriter";
import { SettingsManager } from "./SettingsManager";

export const useSettingsManager = (dependencyInjector: DependencyInjector) => {
    const settingsReader = dependencyInjector.getInstance<SettingsReader>("SettingsReader");
    const settingsWriter = dependencyInjector.getInstance<SettingsWriter>("SettingsWriter");

    dependencyInjector.registerInstance<SettingsManagerInterface>(
        "SettingsManager",
        new SettingsManager(settingsReader, settingsWriter),
    );
};
