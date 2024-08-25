import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { join } from "path";
import { PowershellActionHandler } from "./ActionHandler";
import { PowershellUtility } from "./PowershellUtility";

export class PowershellUtilityModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");
        const app = dependencyRegistry.get("App");
        const powershellScriptFolder = join(app.getPath("userData"), "PowershellUtility");

        await fileSystemUtility.createFolderIfDoesntExist(powershellScriptFolder);

        const powershellUtility = new PowershellUtility(
            fileSystemUtility,
            dependencyRegistry.get("CommandlineUtility"),
            powershellScriptFolder,
            dependencyRegistry.get("RandomStringProvider"),
        );

        dependencyRegistry.register("PowershellUtility", powershellUtility);
        dependencyRegistry.get("ActionHandlerRegistry").register(new PowershellActionHandler(powershellUtility));
    }
}
