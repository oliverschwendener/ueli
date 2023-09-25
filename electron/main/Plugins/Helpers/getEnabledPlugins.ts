import { UeliPlugin } from "@common/UeliPlugin";
import { SettingsManager } from "../../Settings";

export const getEnabledPlugins = (
    plugins: UeliPlugin[],
    settingsManager: SettingsManager,
    pluginIdsEnabledByDefault: string[],
) => {
    return plugins.filter((plugin) =>
        settingsManager
            .getSettingByKey<string[]>("plugins.enabledPluginIds", pluginIdsEnabledByDefault)
            .includes(plugin.id),
    );
};
