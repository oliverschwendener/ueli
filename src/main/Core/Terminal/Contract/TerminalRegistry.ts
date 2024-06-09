import type { Terminal } from "./Terminal";

export interface TerminalRegistry {
    /**
     * Returns all terminals.
     */
    getAll(): Terminal[];

    /**
     * Returns a terminal by its id. Throw an error if the terminal is not found.
     * @param terminalId The terminal ID
     * @returns The terminal
     */
    getById(terminalId: string): Terminal;
}
