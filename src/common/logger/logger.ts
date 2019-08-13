export interface Logger {
    debug(message: string): void;
    error(message: string): void;
    openLog(): Promise<void>;
}
