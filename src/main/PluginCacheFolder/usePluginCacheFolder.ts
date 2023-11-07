import type { DependencyInjector } from "@common/DependencyInjector";
import type { FileSystemUtility } from "@common/FileSystemUtility";
import type { PluginCacheFolder } from "@common/PluginCacheFolder";
import type { App } from "electron";
import { join } from "path";

export const usePluginCacheFolder = async (dependencyInjector: DependencyInjector) => {
    const app = dependencyInjector.getInstance<App>("App");
    const fileSystemUtility = dependencyInjector.getInstance<FileSystemUtility>("FileSystemUtility");

    const pluginCacheFolder: PluginCacheFolder = { path: join(app.getPath("userData"), "PluginCache") };

    await fileSystemUtility.createFolderIfDoesntExist(pluginCacheFolder.path);

    dependencyInjector.registerInstance<PluginCacheFolder>("PluginCacheFolder", pluginCacheFolder);
};
