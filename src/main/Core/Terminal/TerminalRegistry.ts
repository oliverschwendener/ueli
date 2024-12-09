import type { Terminal, TerminalRegistry as TerminalRegistryInterface } from "./Contract";

export class TerminalRegistry implements TerminalRegistryInterface {
    public constructor(private readonly terminals: Terminal[]) {}

    public getAll(): Terminal[] {
        return this.terminals;
    }

    public getById(terminalId: string): Terminal {
        const terminal = this.getAll().find((t) => t.terminalId === terminalId);

        if (terminal) {
            return terminal;
        }

        throw new Error(`Unable to find terminal with id ${terminalId}`);
    }
}
