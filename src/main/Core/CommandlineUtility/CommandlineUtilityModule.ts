import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { CommandlineActionHandler } from "./ActionHandler";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

export class CommandlineUtilityModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const browserRegistry = moduleRegistry.get("BrowserWindowRegistry");

        const commandlineUtility = new NodeJsCommandlineUtility();
        moduleRegistry.register("CommandlineUtility", commandlineUtility);

        moduleRegistry
            .get("ActionHandlerRegistry")
            .register(new CommandlineActionHandler(commandlineUtility, browserRegistry));
    }
}
