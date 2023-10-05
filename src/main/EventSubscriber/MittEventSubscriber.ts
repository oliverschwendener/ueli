import type { EventSubscriber } from "@common/EventSubscriber";
import type { Emitter } from "mitt";

export class MittEventSubscriber implements EventSubscriber {
    public constructor(private readonly emitter: Emitter<Record<string, unknown>>) {}

    public subscribe<T>(event: string, eventHandler: (data?: T) => void): void {
        this.emitter.on(event, eventHandler);
    }
}
