import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItemAction } from "@common/Core";
import type { Clipboard } from "electron";
import type { ActionHandler } from "../Contract";

export class CopyToClipboardActionHandler implements ActionHandler {
    public id = "copyToClipboard";

    public constructor(
        private readonly clipboard: Clipboard,
        private readonly browserWindowNotifer: BrowserWindowNotifier,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        this.clipboard.writeText(action.argument);
        this.browserWindowNotifer.notify("copiedToClipboard");
    }
}
