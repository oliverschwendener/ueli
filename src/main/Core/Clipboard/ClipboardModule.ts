import type { DependencyInjector } from "..";

export class ClipboardModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const clipboard = dependencyInjector.getInstance("Clipboard");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

        ipcMain.on("copyTextToClipboard", (_, { textToCopy }: { textToCopy: string }) => {
            clipboard.writeText(textToCopy);
        });
    }
}
