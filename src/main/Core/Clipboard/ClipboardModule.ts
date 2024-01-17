import type { DependencyRegistry } from "..";

export class ClipboardModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const clipboard = dependencyRegistry.get("Clipboard");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.on("copyTextToClipboard", (_, { textToCopy }: { textToCopy: string }) => {
            clipboard.writeText(textToCopy);
        });
    }
}
