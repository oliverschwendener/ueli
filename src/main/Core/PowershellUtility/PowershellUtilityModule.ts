import { join } from "path";
import type { DependencyInjector } from "..";
import { PowershellUtility } from "./PowershellUtility";

export class PowershellUtilityModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const fileSystemUtility = dependencyInjector.getInstance("FileSystemUtility");
        const commandlineUtility = dependencyInjector.getInstance("CommandlineUtility");
        const app = dependencyInjector.getInstance("App");
        const randomStringProvider = dependencyInjector.getInstance("RandomStringProvider");

        const powershellScriptFolder = join(app.getPath("userData"), "PowershellUtility");

        await fileSystemUtility.createFolderIfDoesntExist(powershellScriptFolder);

        dependencyInjector.registerInstance(
            "PowershellUtility",
            new PowershellUtility(fileSystemUtility, commandlineUtility, powershellScriptFolder, randomStringProvider),
        );
    }
}
