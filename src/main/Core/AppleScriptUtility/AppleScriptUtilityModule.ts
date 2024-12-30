import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { AppleScriptUtility } from "./AppleScriptUtility";

export class AppleScriptUtilityModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("AppleScriptUtility", new AppleScriptUtility(moduleRegistry.get("CommandlineUtility")));
    }
}
