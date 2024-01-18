import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { UeliCommandInvoker } from "./UeliCommandInvoker";

export class UeliCommandModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const eventEmitter = dependencyRegistry.get("EventEmitter");

        dependencyRegistry.register("UeliCommandInvoker", new UeliCommandInvoker(app, eventEmitter));
    }
}
