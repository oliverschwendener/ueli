import type { DependencyInjector } from "../DependencyInjector";
import type { FileSystemUtility } from "./Contract";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<FileSystemUtility>("FileSystemUtility", new NodeJsFileSystemUtility());
    }
}
