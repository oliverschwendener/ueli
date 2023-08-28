import { RealCommandlineUtility } from "./RealCommandlineUtility";
import { RealFileSystemUtility } from "./RealFileSystemUtility";
import { RealPowershellUtility } from "./RealPowershellUtility";

export * from "./CommandlineUtility";
export * from "./FileSystemUtility";
export * from "./PowershellUtility";

export const useUtilities = () => {
    const commandlineUtility = new RealCommandlineUtility();
    const fileSystemUtility = new RealFileSystemUtility();
    const powershellUtility = new RealPowershellUtility();

    return {
        commandlineUtility,
        fileSystemUtility,
        powershellUtility,
    };
};
