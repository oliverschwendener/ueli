/**
 * Offers methods to notify the browser window about events.
 */
export interface BrowserWindowNotifier {
    /**
     * Notifies the browser window about an event.
     * @param channel The channel to notify, e.g. `"myChannel"`.
     * @param data The data to send. Can be anything, a string, number, object, etc. Be aware that the data must be
     * serializable. Functions for example are not serializable.
     */
    notify<T>(channel: string, data?: T): void;
}
