import type { DependencyInjector } from "../DependencyInjector";
import type { CommandlineUtility } from "./Contract";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

export class CommandlineUtilityModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<CommandlineUtility>("CommandlineUtility", new NodeJsCommandlineUtility());
    }
}
