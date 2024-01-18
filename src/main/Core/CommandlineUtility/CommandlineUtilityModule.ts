import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

export class CommandlineUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register("CommandlineUtility", new NodeJsCommandlineUtility());
    }
}
