import type { Emitter } from "mitt";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventSubscriber } from "./Contract";
import { MittEventSubscriber } from "./MittEventSubscriber";

export class EventSubscriberModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const emitter = dependencyInjector.getInstance<Emitter<Record<string, unknown>>>("Emitter");
        dependencyInjector.registerInstance<EventSubscriber>("EventSubscriber", new MittEventSubscriber(emitter));
    }
}
