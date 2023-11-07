import type { DependencyInjector } from "@common/DependencyInjector";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export const useUtilities = (dependencyInjector: DependencyInjector) => {
    const commandlineUtility = new NodeJsCommandlineUtility();
    const fileSystemUtility = new NodeJsFileSystemUtility();

    dependencyInjector.registerInstance("CommandlineUtility", commandlineUtility);
    dependencyInjector.registerInstance("FileSystemUtility", fileSystemUtility);
};
