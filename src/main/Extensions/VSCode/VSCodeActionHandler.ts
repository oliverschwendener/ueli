import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import { exec } from "child_process";

export class VSCodeActionHandler implements ActionHandler {
    public readonly id = "VSCodeHandler";

    public constructor() { }

    public async invokeAction(action: SearchResultItemAction) {
        exec(`code ${action.argument}`);
    }
}
