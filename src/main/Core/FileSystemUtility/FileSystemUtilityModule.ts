import type { DependencyRegistry } from "../DependencyRegistry";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("FileSystemUtility", new NodeJsFileSystemUtility());
    }
}
