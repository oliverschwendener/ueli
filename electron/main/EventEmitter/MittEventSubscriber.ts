import { Emitter } from "mitt";
import type { EventSubscriber } from "./EventSubscriber";

export class MittEventSubscriber implements EventSubscriber {
    public constructor(private readonly emitter: Emitter<Record<string, unknown>>) {}

    public subscribe(event: string, eventHandler: () => void): void {
        this.emitter.on(event, eventHandler);
    }
}
