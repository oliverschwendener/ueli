import type { DependencyRegistry } from "../DependencyRegistry";

export class GlobalShortcutModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const globalShortcut = dependencyRegistry.get("GlobalShortcut");
        const eventEmitter = dependencyRegistry.get("EventEmitter");

        globalShortcut.unregisterAll();
        globalShortcut.register("alt+space", () => eventEmitter.emitEvent("hotkeyPressed"));
    }
}
