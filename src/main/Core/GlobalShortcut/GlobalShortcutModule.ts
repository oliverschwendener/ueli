import type { DependencyInjector } from "../DependencyInjector";

export class GlobalShortcutModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const globalShortcut = dependencyInjector.getInstance("GlobalShortcut");
        const eventEmitter = dependencyInjector.getInstance("EventEmitter");

        globalShortcut.unregisterAll();
        globalShortcut.register("alt+space", () => eventEmitter.emitEvent("hotkeyPressed"));
    }
}
