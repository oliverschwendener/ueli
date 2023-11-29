import type { PluginInfo } from "@common/PluginInfo";
import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { UeliPlugin } from "../Plugins";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../SettingsManager";

export class PluginManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const supportedPlugins = PluginManagerModule.getSupportedPlugins(dependencyInjector);

        PluginManagerModule.registerIpcMainEventListeners(dependencyInjector, supportedPlugins);
        PluginManagerModule.addSearchResultItemsToSearchIndex(dependencyInjector, supportedPlugins);
    }

    private static getSupportedPlugins(dependencyInjector: DependencyInjector): UeliPlugin[] {
        return dependencyInjector.getAllPlugins().filter((plugin) => plugin.isSupported(dependencyInjector));
    }

    private static registerIpcMainEventListeners(
        dependencyInjector: DependencyInjector,
        supportedPlugins: UeliPlugin[],
    ) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");

        ipcMain.on("pluginEnabled", async (_, { pluginId }: { pluginId: string }) => {
            const plugin = supportedPlugins.find(({ id }) => id === pluginId);

            if (!plugin) {
                throw new Error(`Unable to find plugin with id ${pluginId}`);
            }

            searchIndex.addSearchResultItems(plugin.id, await plugin.getSearchResultItems());
        });

        ipcMain.on("getSupportedPlugins", (event) => {
            event.returnValue = supportedPlugins.map(
                ({ id, name, nameTranslationKey }): PluginInfo => ({ id, name, nameTranslationKey }),
            );
        });
    }

    private static async addSearchResultItemsToSearchIndex(
        dependencyInjector: DependencyInjector,
        plugins: UeliPlugin[],
    ) {
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const enabledPlugins = plugins.filter((plugin) =>
            settingsManager
                .getSettingByKey<string[]>("plugins.enabledPluginIds", ["ApplicationSearch"])
                .includes(plugin.id),
        );

        const promiseResults = await Promise.allSettled(enabledPlugins.map((plugin) => plugin.getSearchResultItems()));

        for (let i = 0; i < enabledPlugins.length; i++) {
            const promiseResult = promiseResults[i];
            const { id: pluginId } = enabledPlugins[i];

            promiseResult.status === "fulfilled"
                ? searchIndex.addSearchResultItems(pluginId, promiseResult.value)
                : console.error({
                      error: "Failed ot get search result items by plugin",
                      pluginId: pluginId,
                      reason: promiseResult.reason,
                  });
        }
    }
}
