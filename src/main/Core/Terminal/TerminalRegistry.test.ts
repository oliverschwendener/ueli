import { describe, expect, it } from "vitest";
import type { Terminal } from "./Contract";
import { TerminalRegistry } from "./TerminalRegistry";

describe(TerminalRegistry, () => {
    describe(TerminalRegistry.prototype.getAll, () => {
        it("should return all terminals ", () => {
            const terminals = [<Terminal>{ terminalId: "terminal1" }, <Terminal>{ terminalId: "terminal2" }];
            expect(new TerminalRegistry(terminals).getAll()).toBe(terminals);
        });
    });

    describe(TerminalRegistry.prototype.getById, () => {
        it("should throw an error if the terminal with the given id does not exist", () => {
            expect(() => new TerminalRegistry([]).getById("terminal1")).toThrowError(
                "Unable to find terminal with id terminal1",
            );
        });

        it("should return the terminal if it's found", () => {
            const terminals = [<Terminal>{ terminalId: "terminal1" }, <Terminal>{ terminalId: "terminal2" }];
            expect(new TerminalRegistry(terminals).getById("terminal1")).toBe(terminals[0]);
        });
    });
});
