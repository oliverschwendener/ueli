import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class GlobalShortcutModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const globalShortcut = dependencyRegistry.get("GlobalShortcut");
        const eventEmitter = dependencyRegistry.get("EventEmitter");

        globalShortcut.unregisterAll();
        globalShortcut.register("alt+space", () => eventEmitter.emitEvent("hotkeyPressed"));
    }
}
