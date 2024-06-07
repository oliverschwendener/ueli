import type { OperatingSystem } from "@common/Core";
import type { Terminal, TerminalRegistry as TerminalRegistryInterface } from "./Contract";

export class TerminalRegistry implements TerminalRegistryInterface {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly terminals: Record<OperatingSystem, () => Terminal[]>,
    ) {}

    public getAll(): Terminal[] {
        return this.terminals[this.operatingSystem]();
    }

    public getById(terminalId: string): Terminal {
        const terminal: Terminal | undefined = this.getAll().find((t) => t.terminalId === terminalId);

        if (terminal) {
            return terminal;
        }

        throw new Error(`Unable to find terminal with id ${terminalId}`);
    }
}
