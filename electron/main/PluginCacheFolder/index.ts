import type { App } from "electron";
import { join } from "path";
import type { FileSystemUtility } from "../Utilities";

export const usePluginCacheFolder = ({
    app,
    fileSystemUtility,
}: {
    app: App;
    fileSystemUtility: FileSystemUtility;
}) => {
    const pluginCacheFolderPath = join(app.getPath("userData"), "PluginCache");

    fileSystemUtility.createFolderIfDoesntExist(pluginCacheFolderPath);

    return pluginCacheFolderPath;
};
