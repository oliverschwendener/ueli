export interface EventSubscriber {
    subscribe(event: string, eventHandler: () => void): void;
}
