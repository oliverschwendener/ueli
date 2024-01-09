import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Clipboard } from "electron";
import type { ActionHandler } from "../Contract";

export class CopyToClipboardActionHandler implements ActionHandler {
    public id = "copyToClipboard";

    public constructor(private readonly clipboard: Clipboard) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        this.clipboard.writeText(action.argument);
    }
}
