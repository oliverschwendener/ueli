import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { BrowserWindowNotifier } from "./BrowserWindowNotifier";

export class BrowserWindowNotifierModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const browserWindowNotifier = new BrowserWindowNotifier(moduleRegistry.get("BrowserWindowRegistry"));

        moduleRegistry.register("BrowserWindowNotifier", browserWindowNotifier);
    }
}
