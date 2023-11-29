import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { ActionHandler } from "../Contract";

export class CommandlineActionHandler implements ActionHandler {
    public readonly id = "Commandline";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public invokeAction(action: SearchResultItemAction): Promise<void> {
        return this.commandlineUtility.executeCommand(action.argument);
    }
}
