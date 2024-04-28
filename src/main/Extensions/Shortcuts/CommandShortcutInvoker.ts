import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { ShortcutInvoker } from "./ShortcutInvoker";

export class CommandShortcutInvoker implements ShortcutInvoker {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async invoke(argument: string): Promise<void> {
        await this.commandlineUtility.executeCommand(argument);
    }
}
