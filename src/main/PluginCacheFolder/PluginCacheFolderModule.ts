import type { App } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { FileSystemUtility } from "../FileSystemUtility";
import type { PluginCacheFolder } from "./Contract";

export class PluginCacheFolderModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const fileSystemUtility = dependencyInjector.getInstance<FileSystemUtility>("FileSystemUtility");

        const pluginCacheFolder: PluginCacheFolder = { path: join(app.getPath("userData"), "PluginCache") };

        await fileSystemUtility.createFolderIfDoesntExist(pluginCacheFolder.path);

        dependencyInjector.registerInstance<PluginCacheFolder>("PluginCacheFolder", pluginCacheFolder);
    }
}
