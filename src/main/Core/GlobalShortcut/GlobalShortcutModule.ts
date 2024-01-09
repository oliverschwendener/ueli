import type { GlobalShortcut } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";

export class GlobalShortcutModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const globalShortcut = dependencyInjector.getInstance<GlobalShortcut>("GlobalShortcut");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");

        globalShortcut.unregisterAll();
        globalShortcut.register("alt+space", () => eventEmitter.emitEvent("hotkeyPressed"));
    }
}
