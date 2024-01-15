import type { DependencyInjector } from "@Core/DependencyInjector";
import type { EventSubscriber } from "@Core/EventSubscriber";
import type { Extension } from "@Core/Extension";
import type { SearchIndex } from "@Core/SearchIndex";
import type { IpcMain } from "electron";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { DeeplTranslatorModule } from "./DeeplTranslator";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";
import { UeliCommandModule } from "./UeliCommand";

export class ExtensionsModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ApplicationSearchModule.bootstrap(dependencyInjector);
        DeeplTranslatorModule.bootstrap(dependencyInjector);
        SystemColorThemeSwitcherModule.bootstrap(dependencyInjector);
        UeliCommandModule.bootstrap(dependencyInjector);

        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const searchIndex = dependencyInjector.getInstance<SearchIndex>("SearchIndex");

        const getExtensionById = (extensionId: string): Extension => {
            const extension = dependencyInjector.getAllExtensions().find((e) => e.id === extensionId);

            if (!extension) {
                throw new Error(`Unable to find extension by id "${extensionId}"`);
            }

            return extension;
        };

        ipcMain.on("getExtensionImageUrl", (event, { extensionId }: { extensionId: string }) => {
            const extension = getExtensionById(extensionId);
            event.returnValue = extension.getImageUrl ? extension.getImageUrl() : undefined;
        });

        ipcMain.on(
            "getExtensionSettingDefaultValue",
            (event, { extensionId, settingKey }: { extensionId: string; settingKey: string }) => {
                event.returnValue = getExtensionById(extensionId).getSettingDefaultValue(settingKey);
            },
        );

        ipcMain.handle(
            "invokeExtension",
            (_, { extensionId, argument }: { extensionId: string; argument: unknown }) => {
                const extension = getExtensionById(extensionId);

                if (!extension.invoke) {
                    throw new Error(`Extension with id "${extension}" does not implement a "search" method`);
                }

                return extension.invoke(argument);
            },
        );

        eventSubscriber.subscribe("settingUpdated", async ({ key }: { key: string }) => {
            for (const extension of dependencyInjector.getAllExtensions()) {
                if (extension.settingKeysTriggerindReindex?.includes(key)) {
                    searchIndex.removeSearchResultItems(extension.id);
                    searchIndex.addSearchResultItems(extension.id, await extension.getSearchResultItems());
                }
            }
        });
    }
}
