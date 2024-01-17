import type { DependencyRegistry } from "../DependencyRegistry";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

export class CommandlineUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        dependencyRegistry.register("CommandlineUtility", new NodeJsCommandlineUtility());
    }
}
