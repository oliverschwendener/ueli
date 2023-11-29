import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { ActionHandler } from "./ActionHandler";

export class CommandlineActionHandler implements ActionHandler {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public invoke(action: SearchResultItemAction): Promise<void> {
        return this.commandlineUtility.executeCommand(action.argument);
    }
}
