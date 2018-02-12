import * as os from "os";
import { ProgramRepository, WindowsProgramRepository, MacOsProgramRepository } from "./search-plugins/programs-plugin";
import { IconManager, WindowsIconManager, MacOsIconManager } from "./icon-manager";
import { Executor } from "./executors/executor";

export class Injector {
    public static getCurrentOperatingSystem(): OperatingSystem {
        switch (os.platform()) {
            case "win32": {
                return OperatingSystem.Windows;
            }
            case "darwin": {
                return OperatingSystem.macOS;
            }
            default: {
                throw new Error("This operating system is not supported");
            }
        }
    }

    public static getProgramRepository(): ProgramRepository {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsProgramRepository();
            }
            case OperatingSystem.macOS: {
                return new MacOsProgramRepository();
            }
        }
    }

    public static getIconManager(): IconManager {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsIconManager();
            }
            case OperatingSystem.macOS: {
                return new MacOsIconManager();
            }
        }
    }

    public static getOpenUrlWithDefaultBrowserCommand(url: string): string {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return `start "" "${url}"`;
            }
            case OperatingSystem.macOS: {
                return `open "${url}"`;
            }
        }
    }

    public static getFileExecutionCommand(filePath: string): string {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return `start "" "${filePath}"`;
            }
            case OperatingSystem.macOS: {
                return `open "${filePath}"`;
            }
        }
    }

    public static getFileLocationExecutionCommand(filePath: string): string {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return `start explorer.exe /select,"${filePath}"`;
            }
            case OperatingSystem.macOS: {
                return `open -R "${filePath}"`;
            }
        }
    }

    public static getFilePathRegExp(): RegExp {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
            }
            case OperatingSystem.macOS: {
                return new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
            }
        }
    }

    public static getDirectorySeparator(): string {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return "\\";
            }
            case OperatingSystem.macOS: {
                return "/";
            }
        }
    }
}

export enum OperatingSystem {
    Windows,
    macOS
}