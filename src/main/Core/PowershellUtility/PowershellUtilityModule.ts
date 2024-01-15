import type { App } from "electron";
import { join } from "path";
import type { CommandlineUtility, DependencyInjector, FileSystemUtility, RandomStringProvider } from "..";
import type { PowershellUtility as PowershellUtilityInterface } from "./Contract";
import { PowershellUtility } from "./PowershellUtility";

export class PowershellUtilityModule {
    public static async bootstrap(dependencyInjector: DependencyInjector) {
        const fileSystemUtility = dependencyInjector.getInstance<FileSystemUtility>("FileSystemUtility");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const app = dependencyInjector.getInstance<App>("App");
        const randomStringProvider = dependencyInjector.getInstance<RandomStringProvider>("RandomStringProvider");

        const powershellScriptFolder = join(app.getPath("userData"), "PowershellUtility");

        await fileSystemUtility.createFolderIfDoesntExist(powershellScriptFolder);

        dependencyInjector.registerInstance<PowershellUtilityInterface>(
            "PowershellUtility",
            new PowershellUtility(fileSystemUtility, commandlineUtility, powershellScriptFolder, randomStringProvider),
        );
    }
}
