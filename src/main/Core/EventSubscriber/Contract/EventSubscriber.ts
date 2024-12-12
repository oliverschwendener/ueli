export interface EventSubscriber {
    subscribe<T>(event: string, eventHandler: (data: T) => void): void;
}
