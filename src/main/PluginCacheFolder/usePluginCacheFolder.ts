import type { FileSystemUtility } from "@common/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";

export const usePluginCacheFolder = async ({
    app,
    fileSystemUtility,
}: {
    app: App;
    fileSystemUtility: FileSystemUtility;
}) => {
    const pluginCacheFolderPath = join(app.getPath("userData"), "PluginCache");

    await fileSystemUtility.createFolderIfDoesntExist(pluginCacheFolderPath);

    return pluginCacheFolderPath;
};
