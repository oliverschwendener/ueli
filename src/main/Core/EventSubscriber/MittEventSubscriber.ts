import type { Emitter } from "mitt";
import type { EventSubscriber } from "./Contract";

export class MittEventSubscriber implements EventSubscriber {
    public constructor(private readonly emitter: Emitter<Record<string, unknown>>) {}

    public subscribe<T>(event: string, eventHandler: (data: T) => void): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.emitter.on(event, eventHandler);
    }
}
