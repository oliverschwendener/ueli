import { Logger } from "./logger";
import * as Winston from "winston";

export class ProductionLogger implements Logger {
    private readonly logger: Winston.Logger;
    private readonly fileOpener: (filePath: string) => Promise<void>;

    constructor(fileOpener: (filePath: string, privileged?: boolean) => Promise<void>) {
        this.fileOpener = fileOpener;

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
                    maxFiles: 1,
                    maxsize: 1000000,
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

    public openLog(): Promise<void> {
        return this.fileOpener("debug.log");
    }
}
