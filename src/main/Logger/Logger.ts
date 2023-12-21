import type { Logger as LoggerInterface } from "./Contract";
import type { LogLevel } from "./LogLevel";
import type { LogWriter } from "./LogWriter";

export class Logger implements LoggerInterface {
    public constructor(private logWriters: LogWriter[]) {}

    public error(message: string): void {
        this.writeLog("error", message);
    }

    public info(message: string): void {
        this.writeLog("info", message);
    }

    public debug(message: string): void {
        this.writeLog("debug", message);
    }

    public warn(message: string): void {
        this.writeLog("warning", message);
    }

    private writeLog(level: LogLevel, message: string) {
        for (const logWriter of this.logWriters) {
            logWriter.writeLog(level, message);
        }
    }
}
