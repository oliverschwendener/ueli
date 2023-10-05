import type { EventEmitter } from "@common/EventEmitter";
import type { Emitter } from "mitt";
import { MittEventEmitter } from "./MittEventEmitter";

export const useEventEmitter = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventEmitter =>
    new MittEventEmitter(emitter);
