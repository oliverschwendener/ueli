import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { BrowserWindow } from "electron";
import { BrowserWindowNotifier } from "./BrowserWindowNotifier";

export class BrowserWindowNotifierModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        const browserWindowNotifier = new BrowserWindowNotifier();

        dependencyRegistry.register("BrowserWindowNotifier", browserWindowNotifier);

        eventSubscriber.subscribe("browserWindowCreated", ({ browserWindow }: { browserWindow: BrowserWindow }) => {
            browserWindowNotifier.setBrowserWindow(browserWindow);
        });
    }
}
