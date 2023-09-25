import type { UeliPlugin } from "@common/UeliPlugin";
import type { IpcMain } from "electron";
import { serializePluginToIpcEventReturnValue } from "./serializePluginToIpcEventReturnValue";

export const subscribeToIpcMainEvents = (ipcMain: IpcMain, plugins: UeliPlugin[]) => {
    ipcMain.on("pluginEnabled", (_, { pluginId }: { pluginId: string }) =>
        plugins.find(({ id }) => id === pluginId).addSearchResultItemsToSearchIndex(),
    );

    ipcMain.on("getSupportedPlugins", (event) => {
        event.returnValue = plugins.map((plugin) => serializePluginToIpcEventReturnValue(plugin));
    });
};
