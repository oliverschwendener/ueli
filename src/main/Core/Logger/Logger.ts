import type { Clock } from "../Clock";
import type { Logger as LoggerInterface } from "./Contract";

export class Logger implements LoggerInterface {
    private logs: string[] = [];

    public constructor(private readonly clock: Clock) {}

    public error(message: string): void {
        this.writeLog("ERROR", message);
    }

    public info(message: string): void {
        this.writeLog("INFO", message);
    }

    public debug(message: string): void {
        this.writeLog("DEBUG", message);
    }

    public warn(message: string): void {
        this.writeLog("WARNING", message);
    }

    public getLogs(): string[] {
        return this.logs;
    }

    private writeLog(logLevel: string, message: string) {
        this.logs.push(`[${this.clock.getCurrentTimeAsString()}][${logLevel}] ${message}`);
    }
}
