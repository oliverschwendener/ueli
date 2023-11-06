import type { SettingsManager } from "@common/SettingsManager";
import type { UeliPlugin } from "@common/UeliPlugin";

export const getEnabledPlugins = (
    plugins: UeliPlugin[],
    settingsManager: SettingsManager,
    pluginIdsEnabledByDefault: string[],
) =>
    plugins.filter((plugin) =>
        settingsManager
            .getSettingByKey<string[]>("plugins.enabledPluginIds", pluginIdsEnabledByDefault)
            .includes(plugin.id),
    );
