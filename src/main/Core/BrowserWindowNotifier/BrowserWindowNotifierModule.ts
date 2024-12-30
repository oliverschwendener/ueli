import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { BrowserWindowNotifier } from "./BrowserWindowNotifier";

export class BrowserWindowNotifierModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const browserWindowNotifier = new BrowserWindowNotifier(dependencyRegistry.get("BrowserWindowRegistry"));

        dependencyRegistry.register("BrowserWindowNotifier", browserWindowNotifier);
    }
}
