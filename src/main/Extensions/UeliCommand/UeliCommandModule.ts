import type { App } from "electron";
import type { DependencyInjector } from "../../DependencyInjector";
import type { EventEmitter } from "../../EventEmitter";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");

        dependencyInjector.registerExtension(new UeliCommandExtension());
        dependencyInjector.registerActionHandler(new UeliCommandActionHandler(app, eventEmitter));
    }
}
