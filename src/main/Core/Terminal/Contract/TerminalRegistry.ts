import type { Terminal } from "./Terminal";

export interface TerminalRegistry {
    getAll(): Terminal[];
    getById(terminalId: string): Terminal;
}
