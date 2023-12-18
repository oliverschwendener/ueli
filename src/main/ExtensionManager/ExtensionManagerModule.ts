import type { ExtensionInfo } from "@common/ExtensionInfo";
import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { Extension } from "../Extension";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../SettingsManager";

export class ExtensionManagerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const supportedExtensions = ExtensionManagerModule.getSupportedExtensions(dependencyInjector);

        ExtensionManagerModule.registerIpcMainEventListeners(dependencyInjector, supportedExtensions);
        ExtensionManagerModule.addSearchResultItemsToSearchIndex(dependencyInjector, supportedExtensions);
    }

    private static getSupportedExtensions(dependencyInjector: DependencyInjector): Extension[] {
        return dependencyInjector.getAllExtensions().filter((extension) => extension.isSupported(dependencyInjector));
    }

    private static registerIpcMainEventListeners(
        dependencyInjector: DependencyInjector,
        supportedExtensions: Extension[],
    ) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");

        ipcMain.on("extensionEnabled", async (_, { extensionId }: { extensionId: string }) => {
            const extension = supportedExtensions.find(({ id }) => id === extensionId);

            if (!extension) {
                throw new Error(`Unable to find extension with id ${extensionId}`);
            }

            searchIndex.addSearchResultItems(extension.id, await extension.getSearchResultItems());
        });

        ipcMain.on("getAvailableExtensions", (event) => {
            event.returnValue = supportedExtensions.map(
                ({ id, name, nameTranslationKey }): ExtensionInfo => ({ id, name, nameTranslationKey }),
            );
        });
    }

    private static async addSearchResultItemsToSearchIndex(
        dependencyInjector: DependencyInjector,
        extensions: Extension[],
    ) {
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const enabledExtensions = extensions.filter((extension) =>
            settingsManager
                .getSettingByKey<string[]>("extensions.enabledExtensionIds", ["ApplicationSearch"])
                .includes(extension.id),
        );

        const promiseResults = await Promise.allSettled(
            enabledExtensions.map((extension) => extension.getSearchResultItems()),
        );

        for (let i = 0; i < enabledExtensions.length; i++) {
            const promiseResult = promiseResults[i];
            const { id: extensionId } = enabledExtensions[i];

            if (promiseResult.status === "fulfilled") {
                searchIndex.addSearchResultItems(extensionId, promiseResult.value);
            } else {
                console.error(
                    `Failed ot get search result items for extension with id '${extensionId}.` +
                        `Reason: ${promiseResult.reason}'`,
                );
            }
        }
    }
}
