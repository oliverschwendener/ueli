import type { ExtensionInfo } from "@common/Core";
import type { IpcMain } from "electron";
import type { DependencyInjector, EventSubscriber, ExtensionRegistry } from "..";
import type { Logger } from "../Logger";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../SettingsManager";
import { ExtensionManager } from "./ExtensionManager";

export class ExtensionManagerModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const logger = dependencyInjector.getInstance<Logger>("Logger");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const extensionRegistry = dependencyInjector.getInstance<ExtensionRegistry>("ExtensionRegistry");

        const extensionManager = new ExtensionManager(extensionRegistry, searchIndex, settingsManager, logger);

        await extensionManager.populateSearchIndex(dependencyInjector);

        ipcMain.on("extensionEnabled", (_, { extensionId }: { extensionId: string }) => {
            extensionManager.populateSearchIndexByExtensionId(extensionId);
        });

        ipcMain.on("getAvailableExtensions", (event) => {
            event.returnValue = extensionManager
                .getSupportedExtensions(dependencyInjector)
                .map(({ id, name, nameTranslationKey }): ExtensionInfo => ({ id, name, nameTranslationKey }));
        });

        ipcMain.on("getExtensionImageUrl", (event, { extensionId }: { extensionId: string }) => {
            const extension = extensionRegistry.getById(extensionId);
            event.returnValue = extension.getImageUrl ? extension.getImageUrl() : undefined;
        });

        ipcMain.on(
            "getExtensionSettingDefaultValue",
            (event, { extensionId, settingKey }: { extensionId: string; settingKey: string }) => {
                event.returnValue = extensionRegistry.getById(extensionId).getSettingDefaultValue(settingKey);
            },
        );

        ipcMain.handle(
            "invokeExtension",
            (_, { extensionId, argument }: { extensionId: string; argument: unknown }) => {
                const extension = extensionRegistry.getById(extensionId);

                if (!extension.invoke) {
                    throw new Error(`Extension with id "${extension}" does not implement a "search" method`);
                }

                return extension.invoke(argument);
            },
        );

        eventSubscriber.subscribe("settingUpdated", async ({ key }: { key: string }) => {
            for (const extension of extensionRegistry.getAll()) {
                if (extension.settingKeysTriggerindReindex?.includes(key)) {
                    searchIndex.removeSearchResultItems(extension.id);
                    searchIndex.addSearchResultItems(extension.id, await extension.getSearchResultItems());
                }
            }
        });
    }
}
