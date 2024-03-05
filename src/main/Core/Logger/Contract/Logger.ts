/**
 * Offers methods to log messages.
 */
export interface Logger {
    /**
     * Logs an error message.
     * @param message The message to log, e.g. `"An error occurred."`.
     */
    error(message: string): void;

    /**
     * Logs an info message.
     * @param message The message to log, e.g. `"The application was started."`.
     */
    info(message: string): void;

    /**
     * Logs a debug message.
     * @param message The message to log, e.g. `"The value is 42."`.
     */
    debug(message: string): void;

    /**
     * Logs a warning message.
     * @param message The message to log, e.g. `"The value is close to the limit."`.
     */
    warn(message: string): void;
}
