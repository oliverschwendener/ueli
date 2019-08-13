import { LogMessageType } from "./log-message-type";

export interface LogMessage {
    message: string;
    type: LogMessageType;
}
