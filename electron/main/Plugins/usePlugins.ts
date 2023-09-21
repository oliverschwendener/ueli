import type { UeliPlugin } from "../../../common/UeliPlugin";
import { ApplicationSearchPlugin } from "./ApplicationSearch/ApplicationSearchPlugin";
import type { PluginDependencies } from "./PluginDependencies";

export const usePlugins = (pluginDependencies: PluginDependencies): UeliPlugin[] => {
    const { operatingSystem, searchIndex, eventSubscriber, settingsManager } = pluginDependencies;

    const plugins = [new ApplicationSearchPlugin(pluginDependencies)].filter(({ supportedOperatingSystems }) =>
        supportedOperatingSystems.includes(operatingSystem),
    );

    eventSubscriber.subscribe<{ pluginId: string }>("pluginDisabled", ({ pluginId }) =>
        searchIndex.removeSearchResultItems(pluginId),
    );

    eventSubscriber.subscribe<{ pluginId: string }>("pluginEnabled", ({ pluginId }) =>
        plugins.find(({ id }) => id === pluginId).addSearchResultItemsToSearchIndex(),
    );

    for (const plugin of plugins) {
        if (settingsManager.getSettingByKey("plugins.enabledPluginIds", ["ApplicationSearch"]).includes(plugin.id)) {
            plugin.addSearchResultItemsToSearchIndex();
        }
    }

    return plugins;
};
