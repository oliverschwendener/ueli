import type { ActionHandler } from "@Core/ActionHandler";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItemAction } from "@common/Core";
import type { Clipboard } from "electron";

/**
 * Action handler for copying a string to the clipboard.
 */
export class CopyToClipboardActionHandler implements ActionHandler {
    public id = "copyToClipboard";

    public constructor(
        private readonly clipboard: Clipboard,
        private readonly browserWindowNotifier: BrowserWindowNotifier,
    ) {}

    /**
     * Copies the given string to the clipboard.
     * Expects the given action's argument to be the text that should be copied to the clipboard.
     * Shows a toast notification on the UI when the text has been copied to the clipboard.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        this.clipboard.writeText(action.argument);
        this.browserWindowNotifier.notifyAll({ channel: "copiedToClipboard" });
    }
}
