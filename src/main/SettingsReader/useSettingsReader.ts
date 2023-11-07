import type { DependencyInjector } from "@common/DependencyInjector";
import type { SettingsFile } from "@common/SettingsFile";
import type { SettingsReader } from "@common/SettingsReader";
import { SettingsFileReader } from "./SettingsFileReader";

export const useSettingsReader = (dependencyInjector: DependencyInjector) => {
    const settingsFile = dependencyInjector.getInstance<SettingsFile>("SettingsFile");
    dependencyInjector.registerInstance<SettingsReader>("SettingsReader", new SettingsFileReader(settingsFile.path));
};
