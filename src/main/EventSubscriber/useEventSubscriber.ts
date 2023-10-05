import type { EventSubscriber } from "@common/EventSubscriber";
import type { Emitter } from "mitt";
import { MittEventSubscriber } from "./MittEventSubscriber";

export const useEventSubscriber = ({ emitter }: { emitter: Emitter<Record<string, unknown>> }): EventSubscriber =>
    new MittEventSubscriber(emitter);
