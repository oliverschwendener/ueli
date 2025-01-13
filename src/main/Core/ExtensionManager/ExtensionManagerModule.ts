import type { Extension } from "@Core/Extension";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ExtensionManager } from "./ExtensionManager";
import { RescanStatusManager } from "./RescanStatusManager";
import { mapExtensionToInfo } from "./mapExtensionToInfo";

export class ExtensionManagerModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const browserWindowNotifier = moduleRegistry.get("BrowserWindowNotifier");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");
        const extensionRegistry = moduleRegistry.get("ExtensionRegistry");
        const ipcMain = moduleRegistry.get("IpcMain");
        const logger = moduleRegistry.get("Logger");
        const searchIndex = moduleRegistry.get("SearchIndex");
        const settingsManager = moduleRegistry.get("SettingsManager");

        const rescanStatusManager = new RescanStatusManager("idle", browserWindowNotifier);

        const extensionManager = new ExtensionManager(extensionRegistry, searchIndex, settingsManager, logger);

        ipcMain.on("getRescanStatus", (event) => (event.returnValue = rescanStatusManager.get()));

        ipcMain.on("getExtensionResources", (event) => {
            event.returnValue = extensionManager.getSupportedExtensions().map((extension) => ({
                extensionId: extension.id,
                resources: extension.getI18nResources(),
            }));
        });

        ipcMain.on("getInstantSearchResultItems", (event, { searchTerm }: { searchTerm: string }) => {
            event.returnValue = extensionManager.getInstantSearchResultItems(searchTerm);
        });

        ipcMain.on("extensionEnabled", async (_, { extensionId }: { extensionId: string }) => {
            rescanStatusManager.change("scanning");

            try {
                await extensionManager.populateSearchIndexByExtensionId(extensionId);
                browserWindowNotifier.notifyAll({ channel: "extensionEnabled", data: { extensionId } });
            } finally {
                rescanStatusManager.change("idle");
            }
        });

        ipcMain.on("extensionDisabled", async (_, { extensionId }: { extensionId: string }) => {
            browserWindowNotifier.notifyAll({ channel: "extensionDisabled", data: { extensionId } });
        });

        ipcMain.on("getAvailableExtensions", (event) => {
            event.returnValue = extensionManager.getSupportedExtensions().map((e) => mapExtensionToInfo(e));
        });

        ipcMain.on("getEnabledExtensions", (event) => {
            event.returnValue = extensionManager.getEnabledExtensions().map((e) => mapExtensionToInfo(e));
        });

        ipcMain.on("getExtensionAssetFilePath", (event, { extensionId, key }: { extensionId: string; key: string }) => {
            const extension = extensionRegistry.getById(extensionId);
            event.returnValue = extension.getAssetFilePath ? extension.getAssetFilePath(key) : undefined;
        });

        ipcMain.on("getExtension", (event, { extensionId }: { extensionId: string }) => {
            event.returnValue = mapExtensionToInfo(extensionRegistry.getById(extensionId));
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

        ipcMain.handle("triggerExtensionRescan", async (_, { extensionId }: { extensionId: string }) => {
            rescanStatusManager.change("scanning");

            try {
                await extensionManager.populateSearchIndexByExtensionId(extensionId);
            } finally {
                rescanStatusManager.change("idle");
            }
        });

        eventSubscriber.subscribe("RescanOrchestrator:timeElapsed", async () => {
            rescanStatusManager.change("scanning");
            await extensionManager.populateSearchIndex();
            rescanStatusManager.change("idle");
        });

        eventSubscriber.subscribe("settingUpdated", async ({ key }: { key: string }) => {
            const extensionNeedsRescan = (extension: Extension) =>
                extension.getSettingKeysTriggeringRescan && extension.getSettingKeysTriggeringRescan().includes(key);

            rescanStatusManager.change("scanning");

            await Promise.allSettled(
                extensionManager
                    .getSupportedExtensions()
                    .filter((extension) => extensionNeedsRescan(extension))
                    .map((extension) => extensionManager.populateSearchIndexByExtensionId(extension.id)),
            );

            rescanStatusManager.change("idle");
        });
    }
}
