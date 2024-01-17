import { join } from "path";
import type { DependencyRegistry } from "..";
import { PowershellUtility } from "./PowershellUtility";

export class PowershellUtilityModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry) {
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
