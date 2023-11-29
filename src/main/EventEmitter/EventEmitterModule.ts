import type { Emitter } from "mitt";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "./Contract";
import { MittEventEmitter } from "./MittEventEmitter";

export class EventEmitterModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const emitter = dependencyInjector.getInstance<Emitter<Record<string, unknown>>>("Emitter");
        dependencyInjector.registerInstance<EventEmitter>("EventEmitter", new MittEventEmitter(emitter));
    }
}
