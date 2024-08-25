import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { CopyToClipboardActionHandler } from "./ActionHandler";

export class ClipboardModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const clipboard = dependencyRegistry.get("Clipboard");
        const ipcMain = dependencyRegistry.get("IpcMain");

        dependencyRegistry
            .get("ActionHandlerRegistry")
            .register(new CopyToClipboardActionHandler(clipboard, dependencyRegistry.get("BrowserWindowNotifier")));

        ipcMain.on("copyTextToClipboard", (_, { textToCopy }: { textToCopy: string }) => {
            clipboard.writeText(textToCopy);
        });
    }
}
