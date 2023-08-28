import { Emitter } from "mitt";
import { MittEventEmitter } from "./MittEventEmitter";
import { MittEventSubscriber } from "./MittEventSubscriber";
import { EventEmitter } from "./EventEmitter";
import { EventSubscriber } from "./EventSubscriber";

export * from "./EventEmitter";
export * from "./EventSubscriber";

export const useEventEmitter = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventEmitter =>
    new MittEventEmitter(emitter);

export const useEventSubscriber = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventSubscriber =>
    new MittEventSubscriber(emitter);
