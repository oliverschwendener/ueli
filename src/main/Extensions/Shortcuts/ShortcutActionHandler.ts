import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { ShortcutType } from "@common/Extensions/Shortcuts";
import type { ShortcutInvoker } from "./ShortcutInvoker";

export class ShortcutActionHandler implements ActionHandler {
    public readonly id = "Shortcut";

    public constructor(private readonly handlers: Record<ShortcutType, ShortcutInvoker>) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { type, argument }: { type: ShortcutType; argument: string } = JSON.parse(action.argument);

        const handler = this.handlers[type];

        if (!handler) {
            throw new Error(`Unexpected type: ${type}`);
        }

        await handler.invoke(argument);
    }
}
