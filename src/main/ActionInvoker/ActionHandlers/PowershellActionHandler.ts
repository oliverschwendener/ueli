import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { ActionHandler } from "./ActionHandler";

export class PowershellActionHandler implements ActionHandler {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public invoke(action: SearchResultItemAction): Promise<void> {
        return this.commandlineUtility.executeCommand(`powershell -Command "& {${action.argument}}"`);
    }
}
