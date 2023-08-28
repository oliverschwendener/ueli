import { Emitter } from "mitt";
import type { EventEmitter } from "./EventEmitter";
import type { EventSubscriber } from "./EventSubscriber";
import { MittEventEmitter } from "./MittEventEmitter";
import { MittEventSubscriber } from "./MittEventSubscriber";

export * from "./EventEmitter";
export * from "./EventSubscriber";

export const useEventEmitter = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventEmitter =>
    new MittEventEmitter(emitter);

export const useEventSubscriber = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventSubscriber =>
    new MittEventSubscriber(emitter);
