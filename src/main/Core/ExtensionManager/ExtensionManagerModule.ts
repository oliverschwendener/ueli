import type { Extension } from "@Core/Extension";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionInfo } from "@common/Core";
import { ExtensionManager } from "./ExtensionManager";
import { ScanCounter } from "./ScanCounter";

const mapExtensionToInfo = (extension: Extension): ExtensionInfo => ({
    id: extension.id,
    name: extension.name,
    nameTranslation: extension.nameTranslation,
    image: extension.getImage(),
    author: extension.author,
});

export class ExtensionManagerModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const browserWindowNotifier = moduleRegistry.get("BrowserWindowNotifier");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");
        const extensionRegistry = moduleRegistry.get("ExtensionRegistry");
        const ipcMain = moduleRegistry.get("IpcMain");
        const logger = moduleRegistry.get("Logger");
        const searchIndex = moduleRegistry.get("SearchIndex");
        const settingsManager = moduleRegistry.get("SettingsManager");

        const scanCounter = new ScanCounter();

        const extensionManager = new ExtensionManager(
            extensionRegistry,
            searchIndex,
            settingsManager,
            logger,
            scanCounter,
        );

        ipcMain.on("getScanCount", (event) => (event.returnValue = scanCounter.getScanCount()));

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
            await extensionManager.populateSearchIndexByExtensionId(extensionId);
            browserWindowNotifier.notifyAll({ channel: "extensionEnabled", data: { extensionId } });
        });

        ipcMain.on("extensionDisabled", async (_, { extensionId }: { extensionId: string }) => {
            browserWindowNotifier.notifyAll({ channel: "extensionDisabled", data: { extensionId } });
        });

        ipcMain.on("getAvailableExtensions", (event) => {
            event.returnValue = extensionManager.getSupportedExtensions().map(mapExtensionToInfo);
        });

        ipcMain.on("getEnabledExtensions", (event) => {
            event.returnValue = extensionManager.getEnabledExtensions().map(mapExtensionToInfo);
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

        ipcMain.handle("triggerExtensionRescan", (_, { extensionId }: { extensionId: string }) =>
            extensionManager.populateSearchIndexByExtensionId(extensionId),
        );

        eventSubscriber.subscribe(
            "RescanOrchestrator:timeElapsed",
            async () => await extensionManager.populateSearchIndex(),
        );

        eventSubscriber.subscribe("settingUpdated", async ({ key }: { key: string }) => {
            const extensionNeedsRescan = (extension: Extension) =>
                extension.getSettingKeysTriggeringRescan && extension.getSettingKeysTriggeringRescan().includes(key);

            await Promise.allSettled(
                extensionManager
                    .getSupportedExtensions()
                    .filter((extension) => extensionNeedsRescan(extension))
                    .map((extension) => extensionManager.populateSearchIndexByExtensionId(extension.id)),
            );
        });
    }
}
