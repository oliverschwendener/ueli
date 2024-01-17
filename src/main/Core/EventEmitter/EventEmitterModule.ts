import type { DependencyRegistry } from "../DependencyRegistry";
import { MittEventEmitter } from "./MittEventEmitter";

export class EventEmitterModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const emitter = dependencyRegistry.get("Emitter");
        dependencyRegistry.register("EventEmitter", new MittEventEmitter(emitter));
    }
}
