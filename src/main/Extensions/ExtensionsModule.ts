import type { DependencyInjector } from "@Core/DependencyInjector";
import type { IpcMain } from "electron";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";
import { UeliCommandModule } from "./UeliCommand";

export class ExtensionsModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ApplicationSearchModule.bootstrap(dependencyInjector);
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

        ipcMain.on(
            "getExtensionSettingByKey",
            (event, { extensionId, key, defaultValue }: { extensionId: string; key: string; defaultValue: unknown }) =>
                (event.returnValue = settingsManager.getExtensionSettingByKey(extensionId, key, defaultValue)),
        );

        ipcMain.on(
            "getExtensionSettingDefaultValue",
            (event, { extensionId, settingKey }: { extensionId: string; settingKey: string }) => {
                event.returnValue = getExtensionById(extensionId).getSettingDefaultValue(settingKey);
            },
        );
    }
}
