import { Logger } from "./logger";
import * as Winston from "winston";

export class FileLogger implements Logger {
    private readonly logger: Winston.Logger;

    constructor() {
        const { combine, timestamp, printf } = Winston.format;
        const myFormat = printf(({ level, message, t }) => `${t} ${level}: ${message}`);

        this.logger = Winston.createLogger({
            defaultMeta: { service: "user-service" },
            format: combine(
                timestamp(),
                myFormat,
            ),
            level: "debug",
            transports: [
                new Winston.transports.File({
                    filename: "debug.log",
                    level: "debug",
                }),
                new Winston.transports.Console({
                    level: "debug",
                }),
            ],
        });
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
}
