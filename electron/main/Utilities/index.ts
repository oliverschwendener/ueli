import { RealCommandlineUtility } from "./RealCommandlineUtility";
import { RealFileSystemUtility } from "./RealFileSystemUtility";

export * from "./CommandlineUtility";
export * from "./FileSystemUtility";

export const useUtilities = () => {
    const commandlineUtility = new RealCommandlineUtility();
    const fileSystemUtility = new RealFileSystemUtility();

    return {
        commandlineUtility,
        fileSystemUtility,
    };
};
