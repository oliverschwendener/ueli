import type { UeliPlugin } from "../../../common/UeliPlugin";
import { ApplicationSearchPlugin } from "./ApplicationSearch/ApplicationSearchPlugin";
import type { PluginDependencies } from "./PluginDependencies";
import { WindowsColorThemeSwitcher } from "./WindowsColorThemeSwitcher/WindowsColorThemeSwitcher";

export const usePlugins = (pluginDependencies: PluginDependencies): UeliPlugin[] => {
    const { operatingSystem, searchIndex, eventSubscriber, settingsManager } = pluginDependencies;

    const allPlugins = [
        new ApplicationSearchPlugin(pluginDependencies),
        new WindowsColorThemeSwitcher(pluginDependencies),
    ];

    const pluginsSupportedByCurrentOperatingSystem = allPlugins.filter(({ supportedOperatingSystems }) =>
        supportedOperatingSystems.includes(operatingSystem),
    );

    eventSubscriber.subscribe<{ pluginId: string }>("pluginDisabled", ({ pluginId }) =>
        searchIndex.removeSearchResultItems(pluginId),
    );

    eventSubscriber.subscribe<{ pluginId: string }>("pluginEnabled", ({ pluginId }) =>
        allPlugins.find(({ id }) => id === pluginId).addSearchResultItemsToSearchIndex(),
    );

    for (const plugin of pluginsSupportedByCurrentOperatingSystem) {
        if (settingsManager.getSettingByKey("plugins.enabledPluginIds", ["ApplicationSearch"]).includes(plugin.id)) {
            plugin.addSearchResultItemsToSearchIndex();
        }
    }

    return pluginsSupportedByCurrentOperatingSystem;
};
