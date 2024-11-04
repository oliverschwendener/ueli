import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Logger } from "@Core/Logger";
import type { App, Shell } from "electron";
import { join } from "path";
import type { AutostartManager } from "./AutostartManager";

export class WindowsStoreAutostartManager implements AutostartManager {
    public constructor(
        private readonly app: App,
        private readonly shell: Shell,
        private readonly process: NodeJS.Process,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly logger: Logger,
    ) {}

    public setAutostartOptions(openAtLogin: boolean): void {
        const shortcutFilePath = this.getShortcutFilePath();

        if (openAtLogin) {
            this.createAutostartShortcut(shortcutFilePath);
        } else {
            this.removeAutostartShortcut(shortcutFilePath);
        }
    }

    public autostartIsEnabled(): boolean {
        const shortcutFilePath = this.getShortcutFilePath();

        if (!this.fileSystemUtility.existsSync(shortcutFilePath)) {
            return false;
        }

        try {
            const shortcutLink = this.shell.readShortcutLink(shortcutFilePath);
            return shortcutLink.target === this.process.execPath;
        } catch (error) {
            this.logger.error(`Failed to read shortcut link "${shortcutFilePath}". Reason: ${error}`);
            return false;
        }
    }

    private getShortcutFilePath(): string {
        return join(
            this.app.getPath("appData"),
            "Microsoft",
            "Windows",
            "Start Menu",
            "Programs",
            "Startup",
            "Ueli.lnk",
        );
    }

    private createAutostartShortcut(shortcutFilePath: string): void {
        const shortcutFileExists = this.fileSystemUtility.existsSync(shortcutFilePath);

        this.shell.writeShortcutLink(shortcutFilePath, shortcutFileExists ? "replace" : "create", {
            target: this.process.execPath,
        });
    }

    private removeAutostartShortcut(shortcutFilePath: string): void {
        if (this.fileSystemUtility.existsSync(shortcutFilePath)) {
            this.fileSystemUtility.removeFileSync(shortcutFilePath);
        }
    }
}
