import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { AppleScriptUtility } from "./AppleScriptUtility";

export class AppleScriptUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register(
            "AppleScriptUtility",
            new AppleScriptUtility(dependencyRegistry.get("CommandlineUtility")),
        );
    }
}
