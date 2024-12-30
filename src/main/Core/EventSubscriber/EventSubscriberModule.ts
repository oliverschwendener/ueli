import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { MittEventSubscriber } from "./MittEventSubscriber";

export class EventSubscriberModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("EventSubscriber", new MittEventSubscriber(moduleRegistry.get("Emitter")));
    }
}
