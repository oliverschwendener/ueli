import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { CopyToClipboardActionHandler } from "./ActionHandler";

export class ClipboardModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const clipboard = moduleRegistry.get("Clipboard");
        const ipcMain = moduleRegistry.get("IpcMain");

        moduleRegistry
            .get("ActionHandlerRegistry")
            .register(new CopyToClipboardActionHandler(clipboard, moduleRegistry.get("BrowserWindowNotifier")));

        ipcMain.on("copyTextToClipboard", (_, { textToCopy }: { textToCopy: string }) => {
            clipboard.writeText(textToCopy);
        });
    }
}
