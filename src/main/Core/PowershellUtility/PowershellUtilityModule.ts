import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { join } from "path";
import { PowershellUtility } from "./PowershellUtility";

export class PowershellUtilityModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");
        const commandlineUtility = dependencyRegistry.get("CommandlineUtility");
        const app = dependencyRegistry.get("App");
        const randomStringProvider = dependencyRegistry.get("RandomStringProvider");

        const powershellScriptFolder = join(app.getPath("userData"), "PowershellUtility");

        await fileSystemUtility.createFolderIfDoesntExist(powershellScriptFolder);

        dependencyRegistry.register(
            "PowershellUtility",
            new PowershellUtility(fileSystemUtility, commandlineUtility, powershellScriptFolder, randomStringProvider),
        );
    }
}
