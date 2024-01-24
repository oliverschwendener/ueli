import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { BraveBrowserBookmarkRepository } from "./BraveBrowserBookmarkRepository";
import { BrowserBookmarksExtension } from "./BrowserBookmarksExtension";

export class BrowserBookmarksExtensionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const app = dependencyRegistry.get("App");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");

        return {
            extension: new BrowserBookmarksExtension(new BraveBrowserBookmarkRepository(app, fileSystemUtility)),
        };
    }
}
