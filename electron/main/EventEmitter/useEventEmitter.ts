import type { Emitter } from "mitt";
import type { EventEmitter } from "./EventEmitter";
import { MittEventEmitter } from "./MittEventEmitter";

export const useEventEmitter = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventEmitter =>
    new MittEventEmitter(emitter);
