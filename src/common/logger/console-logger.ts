import { Logger } from "./logger";

export class ConsoleLogger implements Logger {
    public debug(message: string) {
        // tslint:disable-next-line:no-console
        console.log(message);
    }

    public error(message: string) {
        // tslint:disable-next-line:no-console
        console.error(message);
    }
}
