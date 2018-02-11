import * as os from "os";
import { ProgramRepository, WindowsProgramRepository, MacOsProgramRepository } from "./plugins/programs-plugin";
import { FilePathExecutor, WindowsFilePathExecutor, MacOsFilePathExecutor, FilePathValidator, WindowsFilePathValidator, MacOsFilePathValidator } from "./execution-service";
import { IconManager, WindowsIconManager, MacOsIconManager } from "./icon-manager";

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

    public static getFilePathExecutor(): FilePathExecutor {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsFilePathExecutor();
            }
            case OperatingSystem.macOS: {
                return new MacOsFilePathExecutor();
            }
        }
    }

    public static getFilePathValidator(): FilePathValidator {
        switch (Injector.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsFilePathValidator();
            }
            case OperatingSystem.macOS: {
                return new MacOsFilePathValidator();
            }
        }
    }
}

export enum OperatingSystem {
    Windows,
    macOS
}