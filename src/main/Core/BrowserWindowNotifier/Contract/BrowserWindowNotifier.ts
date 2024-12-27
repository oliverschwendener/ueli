/**
 * Offers methods to notify the browser window about events.
 */
export interface BrowserWindowNotifier {
    /**
     * Notifies a specific browser window about an event.
     * @param args.browserWindowId The id of the browser window to notify, e.g. `"myWindow"`.
     * @param args.channel The channel to notify, e.g. `"myChannel"`.
     * @param args.data The data to send. Can be anything, a string, number, object, etc. Be aware that the data must be
     * serializable. Functions for example are not serializable.
     */
    notify<T>(args: { browserWindowId: string; channel: string; data?: T }): void;

    /**
     * Notifies all browser windows about an event.
     * @param args.browserWindowId The id of the browser window to notify, e.g. `"myWindow"`.
     * @param args.channel The channel to notify, e.g. `"myChannel"`.
     * @param args.data The data to send. Can be anything, a string, number, object, etc. Be aware that the data must be
     * serializable. Functions for example are not serializable.
     */
    notifyAll<T>(args: { channel: string; data?: T }): void;
}
