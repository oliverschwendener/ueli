import type { Shell } from "electron";
import type { ShortcutInvoker } from "./ShortcutInvoker";

export class FileShortcutInvoker implements ShortcutInvoker {
    constructor(private readonly shell: Shell) {}

    async invoke(argument: string) {
        const errorMessage = await this.shell.openPath(argument);

        if (errorMessage) {
            throw new Error(`Failed to open file or folder. Reason: ${errorMessage}`);
        }
    }
}
