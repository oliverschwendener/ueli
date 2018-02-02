import * as os from "os";
import { ProgramRepository, WindowsProgramRepository, LinuxProgramRepository, MacOsProgramRepository } from "./plugins/programs-plugin";

export class Config {
    public static getCurrentOperatingSystem(): OperatingSystem {
        switch (os.platform()) {
            case "win32": {
                return OperatingSystem.Windows;
            }
            case "darwin": {
                return OperatingSystem.macOS;
            }
            case "linux": {
                return OperatingSystem.Linux;
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
            case OperatingSystem.Linux: {
                return new LinuxProgramRepository();
            }
            case OperatingSystem.macOS: {
                return new MacOsProgramRepository();
            }
        }
    }
}

export enum OperatingSystem {
    Windows,
    macOS,
    Linux
}