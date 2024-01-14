import type { DependencyInjector } from "@Core/DependencyInjector";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
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
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

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
            "getExtensionSettingValue",
            (event, { extensionId, key, defaultValue }: { extensionId: string; key: string; defaultValue: unknown }) =>
                (event.returnValue = settingsManager.getExtensionValue(extensionId, key, defaultValue)),
        );

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
    }
}
