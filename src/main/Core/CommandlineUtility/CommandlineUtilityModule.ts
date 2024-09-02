import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { CommandlineActionHandler } from "./ActionHandler";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

export class CommandlineUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const commandlineUtility = new NodeJsCommandlineUtility();

        dependencyRegistry.register("CommandlineUtility", commandlineUtility);
        dependencyRegistry.get("ActionHandlerRegistry").register(new CommandlineActionHandler(commandlineUtility));
    }
}
