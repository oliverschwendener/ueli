import * as os from "os";
import { ProgramRepository, WindowsProgramRepository, MacOsProgramRepository } from "./plugins/programs-plugin";
import { IconManager, WindowsIconManager, MacOsIconManager } from "./icon-manager";
import { Executor } from "./executors/executor";
import { WindowsFilePathExecutor, MacOsFilePathExecutor, FileLocationExecutor } from "./executors/file-path-executor";
import { UrlExecutor, WindowsUrlExecutor, MacOsUrlExecutor } from "./executors/web-url-executor";

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

    public static getFilePathExecutor(): Executor {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsFilePathExecutor();
            }
            case OperatingSystem.macOS: {
                return new MacOsFilePathExecutor();
            }
        }
    }

    public static getFileLocationExecutor(): FileLocationExecutor {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsFilePathExecutor();
            }
            case OperatingSystem.macOS: {
                return new MacOsFilePathExecutor();
            }
        }
    }

    public static getUrlExecutor(): UrlExecutor {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsUrlExecutor();
            }
            case OperatingSystem.macOS: {
                return new MacOsUrlExecutor();
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