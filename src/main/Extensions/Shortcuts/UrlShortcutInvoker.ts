import type { Shell } from "electron";
import type { ShortcutInvoker } from "./ShortcutInvoker";

export class UrlShortcutInvoker implements ShortcutInvoker {
    constructor(private readonly shell: Shell) {}

    async invoke(argument: string) {
        await this.shell.openExternal(argument);
    }
}
