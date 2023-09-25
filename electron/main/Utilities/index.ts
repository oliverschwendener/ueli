import { RealCommandlineUtility } from "./RealCommandlineUtility";
import { RealFileSystemUtility } from "./RealFileSystemUtility";

export type * from "./CommandlineUtility";
export type * from "./FileSystemUtility";

export const useUtilities = () => {
    const commandlineUtility = new RealCommandlineUtility();
    const fileSystemUtility = new RealFileSystemUtility();

    return {
        commandlineUtility,
        fileSystemUtility,
    };
};
