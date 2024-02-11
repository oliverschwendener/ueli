export interface BrowserWindowNotifier {
    notify<T>(channel: string, data?: T): void;
}
