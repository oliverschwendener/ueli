import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { MittEventEmitter } from "./MittEventEmitter";

export class EventEmitterModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const emitter = dependencyRegistry.get("Emitter");
        dependencyRegistry.register("EventEmitter", new MittEventEmitter(emitter));
    }
}
