import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { IpcMain } from "electron";
import type { PluginDependencies } from "../Plugins";
import type { SettingsManager } from "../Settings";

export class PluginManager {
    public constructor(
        private readonly plugins: UeliPlugin[],
        private readonly pluginIdsEnabledByDefault: string[],
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly settingsManager: SettingsManager,
        private readonly ipcMain: IpcMain,
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
        this.ipcMain.on("pluginEnabled", (_, { pluginId }: { pluginId: string }) =>
            this.plugins.find(({ id }) => id === pluginId).addSearchResultItemsToSearchIndex(),
        );

        this.ipcMain.on("getSupportedPlugins", (event) => {
            event.returnValue = this.getSupportedPlugins().map((plugin) =>
                PluginManager.serializePluginToIpcEventReturnValue(plugin),
            );
        });
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

    private static serializePluginToIpcEventReturnValue({
        id,
        name,
        nameTranslationKey,
        supportedOperatingSystems,
    }: UeliPlugin) {
        return {
            id,
            name,
            nameTranslationKey,
            supportedOperatingSystems,
        };
    }
}
