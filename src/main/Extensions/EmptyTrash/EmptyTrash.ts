import type { ExecOptions } from "child_process";
import { exec } from "child_process";
import { platform } from "os";

interface CommandOptions {
    command: string;
    options?: ExecOptions;
}

export class EmptyTrash {
    public static async emptyTrash(): Promise<boolean> {
        return new Promise((resolve) => {
            const command = this.getEmptyTrashCommand();

            if (!command) {
                resolve(false);
                return;
            }

            exec(command.command, command.options || {}, (error: Error | null) => {
                if (error) {
                    console.error("Error emptying trash:", error);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }

    private static getEmptyTrashCommand(): CommandOptions | null {
        const os = platform();

        switch (os) {
            case "darwin": // macOS
                return {
                    command:
                        "osascript -e 'tell application \"Finder\" to activate' -e 'tell application \"Finder\" to if ((count of items in trash) > 0) then empty trash'",
                };
            case "win32": // Windows
                return {
                    command: 'PowerShell.exe -Command "Clear-RecycleBin -Force"',
                    options: {
                        windowsHide: true,
                    },
                };
            case "linux": // Linux
                return { command: "rm -rf ~/.local/share/Trash/*" };
            default:
                return null;
        }
    }
}
