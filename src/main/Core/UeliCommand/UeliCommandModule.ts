import type { DependencyRegistry } from "../DependencyRegistry";
import { UeliCommandInvoker } from "./UeliCommandInvoker";

export class UeliCommandModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const app = dependencyRegistry.get("App");
        const eventEmitter = dependencyRegistry.get("EventEmitter");

        dependencyRegistry.register("UeliCommandInvoker", new UeliCommandInvoker(app, eventEmitter));
    }
}
