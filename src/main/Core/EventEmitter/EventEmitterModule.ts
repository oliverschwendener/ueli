import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { MittEventEmitter } from "./MittEventEmitter";

export class EventEmitterModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("EventEmitter", new MittEventEmitter(moduleRegistry.get("Emitter")));
    }
}
