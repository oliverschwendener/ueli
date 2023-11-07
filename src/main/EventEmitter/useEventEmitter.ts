import type { DependencyInjector } from "@common/DependencyInjector";
import type { EventEmitter } from "@common/EventEmitter";
import type { Emitter } from "mitt";
import { MittEventEmitter } from "./MittEventEmitter";

export const useEventEmitter = (dependencyInjector: DependencyInjector) => {
    const emitter = dependencyInjector.getInstance<Emitter<Record<string, unknown>>>("Emitter");
    dependencyInjector.registerInstance<EventEmitter>("EventEmitter", new MittEventEmitter(emitter));
};
