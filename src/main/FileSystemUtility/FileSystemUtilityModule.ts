import type { DependencyInjector } from "../DependencyInjector";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("FileSystemUtility", new NodeJsFileSystemUtility());
    }
}
