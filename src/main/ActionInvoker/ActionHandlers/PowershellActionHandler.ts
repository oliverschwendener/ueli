import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { ActionHandler } from "../Contract/ActionHandler";

export class PowershellActionHandler implements ActionHandler {
    public readonly id = "Powershell";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public invoke(action: SearchResultItemAction): Promise<void> {
        return this.commandlineUtility.executeCommand(`powershell -Command "& {${action.argument}}"`);
    }
}
