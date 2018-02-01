import * as os from "os";
import { ProgramRepository, WindowsProgramRepository } from "./plugins/programs-plugin";

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
        }
    }

    public static getProgramRepository(): ProgramRepository {
        switch (Config.getCurrentOperatingSystem()) {
            case OperatingSystem.Windows: {
                return new WindowsProgramRepository();
            }
        }
    }
}

export enum OperatingSystem {
    Windows,
    macOS,
    Linux
}