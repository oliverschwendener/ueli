import type { Emitter } from "mitt";
import type { EventSubscriber } from "./EventSubscriber";
import { MittEventSubscriber } from "./MittEventSubscriber";

export const useEventSubscriber = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventSubscriber =>
    new MittEventSubscriber(emitter);
