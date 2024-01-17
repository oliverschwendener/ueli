import { join } from "path";
import type { DependencyRegistry } from "../DependencyRegistry";
import type { ExtensionCacheFolder } from "./Contract";

export class ExtensionCacheFolderModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry) {
        const app = dependencyRegistry.get("App");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");

        const extensionCacheFolder: ExtensionCacheFolder = { path: join(app.getPath("userData"), "ExtensionCache") };

        await fileSystemUtility.createFolderIfDoesntExist(extensionCacheFolder.path);

        dependencyRegistry.register("ExtensionCacheFolder", extensionCacheFolder);
    }
}
