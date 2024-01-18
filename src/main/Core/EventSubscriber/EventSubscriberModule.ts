import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { MittEventSubscriber } from "./MittEventSubscriber";

export class EventSubscriberModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const emitter = dependencyRegistry.get("Emitter");
        dependencyRegistry.register("EventSubscriber", new MittEventSubscriber(emitter));
    }
}
