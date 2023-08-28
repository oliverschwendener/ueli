import type { App } from "electron";
import { join } from "path";
import { FileSystemUtility } from "../../Utilities";

export const ensureCacheFolderExists = (app: App) => {
    const pluginCacheFolderPath = join(app.getPath("userData"), "PluginCache");

    FileSystemUtility.createFolderIfDoesntExist(pluginCacheFolderPath);

    return { pluginCacheFolderPath };
};
