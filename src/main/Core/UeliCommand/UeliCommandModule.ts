import type { DependencyInjector } from "../DependencyInjector";
import { UeliCommandInvoker } from "./UeliCommandInvoker";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance("App");
        const eventEmitter = dependencyInjector.getInstance("EventEmitter");

        dependencyInjector.registerInstance("UeliCommandInvoker", new UeliCommandInvoker(app, eventEmitter));
    }
}
