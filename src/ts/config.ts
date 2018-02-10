import * as os from "os";
import { ProgramRepository, WindowsProgramRepository, MacOsProgramRepository } from "./plugins/programs-plugin";
import { ExecutionService, WindowsExecutionService, MacOsExecutionService } from "./execution-service";
import { IconManager, WindowsIconManager, MacOsIconManager } from "./icon-manager";

export class Config {
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
        switch (Config.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsProgramRepository();
            }
            case OperatingSystem.macOS: {
                return new MacOsProgramRepository();
            }
        }
    }

    public static getExecutionService(): ExecutionService {
        switch (Config.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsExecutionService();
            }
            case OperatingSystem.macOS: {
                return new MacOsExecutionService();
            }
        }
    }

    public static getIconManager(): IconManager {
        switch (Config.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsIconManager();
            }
            case OperatingSystem.macOS: {
                return new MacOsIconManager();
            }
        }
    }
}

export enum OperatingSystem {
    Windows,
    macOS
}