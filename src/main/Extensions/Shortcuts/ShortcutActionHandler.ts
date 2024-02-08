import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { ShortcutType } from "@common/Extensions/Shortcuts";
import type { Shell } from "electron";

export class ShortcutActionHandler implements ActionHandler {
    public readonly id = "Shortcut";

    private readonly handlers: Record<ShortcutType, (argument: string) => Promise<void>> = {
        File: async (a) => this.openFileOrFolder(a),
        Url: async (a) => this.shell.openExternal(a),
    };

    public constructor(private readonly shell: Shell) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { type, argument } = JSON.parse(action.argument);

        const handler = this.handlers[type];

        if (!handler) {
            throw new Error(`Unexpected type: ${type}`);
        }

        await handler(argument);
    }

    private async openFileOrFolder(path: string): Promise<void> {
        const errorMessage = await this.shell.openPath(path);

        if (errorMessage) {
            throw new Error(`Failed to open file or folder. Reason: ${errorMessage}`);
        }
    }
}
