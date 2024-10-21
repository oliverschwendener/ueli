import type { Emitter } from "mitt";
import type { EventSubscriber } from "./Contract";

export class MittEventSubscriber implements EventSubscriber {
    public constructor(private readonly emitter: Emitter<Record<string, unknown>>) {}

    public subscribe<T>(event: string, eventHandler: (data: T) => void): void {
        this.emitter.on(event, (event) => eventHandler(event as T));
    }
}
