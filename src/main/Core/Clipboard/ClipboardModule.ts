import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class ClipboardModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const clipboard = dependencyRegistry.get("Clipboard");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.on("copyTextToClipboard", (_, { textToCopy }: { textToCopy: string }) => {
            clipboard.writeText(textToCopy);
        });
    }
}
