import type { DependencyInjector } from "@common/DependencyInjector";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

export class CommandlineUtilityModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance("CommandlineUtility", new NodeJsCommandlineUtility());
    }
}
