import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { FileSystemUtility } from "@common/FileSystemUtility";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export const useUtilities = (): { commandlineUtility: CommandlineUtility; fileSystemUtility: FileSystemUtility } => {
    return {
        commandlineUtility: new NodeJsCommandlineUtility(),
        fileSystemUtility: new NodeJsFileSystemUtility(),
    };
};
