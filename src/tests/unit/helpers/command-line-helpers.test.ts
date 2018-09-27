import { CommandLineProgram } from "../../../ts/command-line-program";
import { CommandLineHelpers } from "../../../ts/helpers/command-line-helpers";
import { InputOutputCombination } from "../test-helpers";

describe(CommandLineHelpers.name, (): void => {
    describe(CommandLineHelpers.buildCommand.name, (): void => {
        it("should build command correctly", (): void => {
            const combinations: InputOutputCombination[] = [
                {
                    input: ">ipconfig /flushdns",
                    output: {
                        args: ["/flushdns"],
                        name: "ipconfig",
                    } as CommandLineProgram,
                },
                {
                    input: ">ls -la .",
                    output: {
                        args: ["-la", "."],
                        name: "ls",
                    } as CommandLineProgram,
                },
                {
                    input: "df -h",
                    output: {
                        args: ["-h"],
                        name: "df",
                    } as CommandLineProgram,
                },
            ];

            for (const combination of combinations) {
                const actual = CommandLineHelpers.buildCommand(combination.input);
                expect(actual.name).toBe(combination.output.name);
                expect(actual.args.length).toBe(combination.output.args.length);
                for (let i = 0; i < actual.args.length; i++) {
                    expect(actual.args[i]).toBe(combination.output.args[i]);
                }
            }
        });
    });
});
