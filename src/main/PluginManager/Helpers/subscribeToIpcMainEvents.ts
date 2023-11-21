import type { SearchIndex } from "@common/SearchIndex";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { IpcMain } from "electron";
import { serializePluginToIpcEventReturnValue } from "./serializePluginToIpcEventReturnValue";

export const subscribeToIpcMainEvents = ({
    ipcMain,
    plugins,
    searchIndex,
}: {
    ipcMain: IpcMain;
    plugins: UeliPlugin[];
    searchIndex: SearchIndex;
}) => {
    ipcMain.on("pluginEnabled", async (_, { pluginId }: { pluginId: string }) => {
        const plugin = plugins.find(({ id }) => id === pluginId);

        if (!plugin) {
            throw new Error(`Unable to find plugin with id ${pluginId}`);
        }

        searchIndex.addSearchResultItems(plugin.id, await plugin.getSearchResultItems());
    });

    ipcMain.on("getSupportedPlugins", (event) => {
        event.returnValue = plugins.map((plugin) => serializePluginToIpcEventReturnValue(plugin));
    });
};
