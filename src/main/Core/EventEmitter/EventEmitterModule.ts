import type { DependencyInjector } from "../DependencyInjector";
import { MittEventEmitter } from "./MittEventEmitter";

export class EventEmitterModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const emitter = dependencyInjector.getInstance("Emitter");
        dependencyInjector.registerInstance("EventEmitter", new MittEventEmitter(emitter));
    }
}
