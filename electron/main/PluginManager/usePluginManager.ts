import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { EventSubscriber } from "../EventSubscriber";
import type { PluginDependencies } from "../Plugins";
import type { SettingsManager } from "../Settings";
import { PluginManager } from "./PluginManager";

export const usePluginManager = ({
    eventSubscriber,
    operatingSystem,
    pluginDependencies,
    pluginIdsEnabledByDefault,
    plugins,
    settingsManager,
}: {
    eventSubscriber: EventSubscriber;
    operatingSystem: OperatingSystem;
    pluginDependencies: PluginDependencies;
    pluginIdsEnabledByDefault: string[];
    plugins: UeliPlugin[];
    settingsManager: SettingsManager;
}) => {
    const pluginManager = new PluginManager(
        plugins,
        pluginIdsEnabledByDefault,
        operatingSystem,
        settingsManager,
        eventSubscriber,
    );

    pluginManager.setPluginDependencies(pluginDependencies);
    pluginManager.subscribeToEvents();
    pluginManager.addSearchResultItemsToSearchIndex();

    return pluginManager;
};
