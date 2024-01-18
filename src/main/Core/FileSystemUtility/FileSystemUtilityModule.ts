import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("FileSystemUtility", new NodeJsFileSystemUtility());
    }
}
