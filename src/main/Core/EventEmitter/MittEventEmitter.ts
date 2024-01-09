import type { Emitter } from "mitt";
import type { EventEmitter } from "./Contract";

export class MittEventEmitter implements EventEmitter {
    public constructor(private readonly emitter: Emitter<Record<string, unknown>>) {}

    public emitEvent<T>(event: string, data?: T): void {
        this.emitter.emit(event, data);
    }
}
