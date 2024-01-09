import type { App } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import type { UeliCommandInvoker as UeliCommandInvokerInterface } from "./Contract";
import { UeliCommandInvoker } from "./UeliCommandInvoker";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");

        dependencyInjector.registerInstance<UeliCommandInvokerInterface>(
            "UeliCommandInvoker",
            new UeliCommandInvoker(app, eventEmitter),
        );
    }
}
