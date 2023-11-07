import type { DependencyInjector } from "@common/DependencyInjector";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("FileSystemUtility", new NodeJsFileSystemUtility());
    }
}
