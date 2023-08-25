import { Emitter } from "mitt";
import { MittEventEmitter } from "./MittEventEmitter";
import { MittEventSubscriber } from "./MittEventSubscriber";

export * from "./EventEmitter";
export * from "./EventSubscriber";

export const useEventEmitter = (emitter: Emitter<Record<string, unknown>>) => {
    const eventEmitter = new MittEventEmitter(emitter);

    return { eventEmitter };
};

export const useEventSubscriber = (emitter: Emitter<Record<string, unknown>>) => {
    const eventSubscriber = new MittEventSubscriber(emitter);

    return { eventSubscriber };
};
