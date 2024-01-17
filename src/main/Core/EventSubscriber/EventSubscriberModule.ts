import type { DependencyInjector } from "../DependencyInjector";
import { MittEventSubscriber } from "./MittEventSubscriber";

export class EventSubscriberModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const emitter = dependencyInjector.getInstance("Emitter");
        dependencyInjector.registerInstance("EventSubscriber", new MittEventSubscriber(emitter));
    }
}
