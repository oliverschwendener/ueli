import { Emitter } from "mitt";
import { EventEmitter } from "./EventEmitter";

export class MittEventEmitter implements EventEmitter {
    public constructor(private readonly emitter: Emitter<Record<string, unknown>>) {}

    public emitEvent(event: string): void {
        this.emitter.emit(event);
    }
}
