import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import { EmptyTrash } from "./EmptyTrash";

export class EmptyTrashActionHandler implements ActionHandler {
    public readonly id = "EmptyTrash";

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        if (action.argument !== "empty") {
            throw new Error(`Argument "${action.argument}" is not supported`);
        }

        const success = await EmptyTrash.emptyTrash();
        if (!success) {
            throw new Error("Failed to empty trash");
        }
    }
}
