import type { DependencyRegistry } from "../DependencyRegistry";
import { MittEventSubscriber } from "./MittEventSubscriber";

export class EventSubscriberModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const emitter = dependencyRegistry.get("Emitter");
        dependencyRegistry.register("EventSubscriber", new MittEventSubscriber(emitter));
    }
}
