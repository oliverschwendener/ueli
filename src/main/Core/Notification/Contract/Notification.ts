export interface Notification {
    show({ title, body }: { title: string; body: string }): void;
}
