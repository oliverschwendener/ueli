import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventEmitter } from "@common/EventEmitter";
import type { GlobalShortcut } from "electron";

export class GlobalShortcutModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const globalShortcut = dependencyInjector.getInstance<GlobalShortcut>("GlobalShortcut");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");

        globalShortcut.unregisterAll();
        globalShortcut.register("alt+space", () => eventEmitter.emitEvent("hotkeyPressed"));
    }
}
