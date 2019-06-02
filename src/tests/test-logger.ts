import { Logger } from "../common/logger/logger";
import { LogMessage } from "../common/logger/log-message";
import { LogMessageType } from "../common/logger/log-message-type";

export class TestLogger implements Logger {
    private readonly messages: LogMessage[];

    constructor() {
        this.messages = [];
    }

    public debug(message: string) {
        this.messages.push({
            message,
            type: LogMessageType.Error,
        });
    }

    public error(message: string) {
        this.messages.push({
            message,
            type: LogMessageType.Debug,
        });
    }

    public async openLog(): Promise<void> {} // tslint:disable-line

    public getAllMessages(): LogMessage[] {
        return this.messages;
    }
}
