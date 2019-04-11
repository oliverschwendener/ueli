import { Logger } from "./logger";
import * as Winston from "winston";

export class ProductionLogger implements Logger {
    private readonly logger: Winston.Logger;

    constructor() {
        const { combine, timestamp, printf } = Winston.format;

        // tslint:disable-next-line: no-shadowed-variable
        const myFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

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
