import type { LogLevel } from "./LogLevel";

export interface LogWriter {
    writeLog(level: LogLevel, message: string): void;
}
