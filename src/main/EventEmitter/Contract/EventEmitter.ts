export interface EventEmitter {
    emitEvent<T>(event: string, data?: T): void;
}
