import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { EventSubscriber } from "../EventSubscriber";
import type { PluginDependencies } from "../Plugins";
import type { SettingsManager } from "../Settings";

export class PluginManager {
    public constructor(
        private readonly plugins: UeliPlugin[],
        private readonly pluginIdsEnabledByDefault: string[],
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly settingsManager: SettingsManager,
        private readonly eventSubscriber: EventSubscriber,
    ) {}

    public setPluginDependencies(pluginDependencies: PluginDependencies) {
        for (const plugin of this.plugins) {
            plugin.setPluginDependencies(pluginDependencies);
        }
    }

    public getSupportedPlugins(): UeliPlugin[] {
        return this.plugins.filter((plugin) => plugin.supportedOperatingSystems.includes(this.currentOperatingSystem));
    }

    public subscribeToEvents(): void {
        this.eventSubscriber.subscribe<{ pluginId: string }>("pluginEnabled", ({ pluginId }) =>
            this.plugins.find(({ id }) => id === pluginId).addSearchResultItemsToSearchIndex(),
        );
    }

    public addSearchResultItemsToSearchIndex(): void {
        for (const plugin of this.getEnabledPlugins()) {
            plugin.addSearchResultItemsToSearchIndex();
        }
    }

    private getEnabledPlugins(): UeliPlugin[] {
        return this.getSupportedPlugins().filter((plugin) =>
            this.settingsManager
                .getSettingByKey<string[]>("plugins.enabledPluginIds", this.pluginIdsEnabledByDefault)
                .includes(plugin.id),
        );
    }
}
