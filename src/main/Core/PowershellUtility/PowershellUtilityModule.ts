import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { join } from "path";
import { PowershellActionHandler } from "./ActionHandler";
import { PowershellUtility } from "./PowershellUtility";

export class PowershellUtilityModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const app = moduleRegistry.get("App");
        const powershellScriptFolder = join(app.getPath("userData"), "PowershellUtility");

        await fileSystemUtility.createFolderIfDoesntExist(powershellScriptFolder);

        const powershellUtility = new PowershellUtility(
            fileSystemUtility,
            moduleRegistry.get("CommandlineUtility"),
            powershellScriptFolder,
            moduleRegistry.get("RandomStringProvider"),
        );

        moduleRegistry.register("PowershellUtility", powershellUtility);
        moduleRegistry.get("ActionHandlerRegistry").register(new PowershellActionHandler(powershellUtility));
    }
}
