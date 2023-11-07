import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventSubscriber } from "@common/EventSubscriber";
import type { Emitter } from "mitt";
import { MittEventSubscriber } from "./MittEventSubscriber";

export class EventSubscriberModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const emitter = dependencyInjector.getInstance<Emitter<Record<string, unknown>>>("Emitter");
        dependencyInjector.registerInstance<EventSubscriber>("EventSubscriber", new MittEventSubscriber(emitter));
    }
}
