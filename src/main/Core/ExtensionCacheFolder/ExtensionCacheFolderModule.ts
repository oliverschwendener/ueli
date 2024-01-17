import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { ExtensionCacheFolder } from "./Contract";

export class ExtensionCacheFolderModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance("App");
        const fileSystemUtility = dependencyInjector.getInstance("FileSystemUtility");

        const extensionCacheFolder: ExtensionCacheFolder = { path: join(app.getPath("userData"), "ExtensionCache") };

        await fileSystemUtility.createFolderIfDoesntExist(extensionCacheFolder.path);

        dependencyInjector.registerInstance("ExtensionCacheFolder", extensionCacheFolder);
    }
}
