import type { LogLevel } from "./LogLevel";
import type { LogWriter } from "./LogWriter";

export class ConsoleLogWriter implements LogWriter {
    private map: Record<LogLevel, (message: string) => void> = {
        debug: (message) => console.debug(message),
        error: (message) => console.error(message),
        info: (message) => console.info(message),
        warning: (message) => console.warn(message),
    };

    public writeLog(level: LogLevel, message: string): void {
        this.map[level](message);
    }
}
