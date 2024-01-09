import { Clock } from "../Clock";
import type { Logger as LoggerInterface } from "./Contract";
import type { LogLevel } from "./LogLevel";

export class Logger implements LoggerInterface {
    private logs: string[] = [];

    public constructor(private readonly clock: Clock) {}

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

    public getLogs(): string[] {
        return this.logs;
    }

    private writeLog(level: LogLevel, message: string) {
        this.logs.push(`[${this.clock.getCurrentTimeAsString()}][${level.toUpperCase()}] ${message}`);
    }
}
