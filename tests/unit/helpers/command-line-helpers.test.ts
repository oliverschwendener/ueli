import { expect } from "chai";
import { InputOutputCombination } from "../test-helpers";
import { CommandLineHelpers, CommandLineProgram } from "../../../src/ts/helpers/command-line-helpers";

describe(CommandLineHelpers.name, (): void => {
    describe(CommandLineHelpers.buildCommand.name, (): void => {
        it("should build command correctly", (): void => {
            let combinations = [
                <InputOutputCombination>{
                    input: ">ipconfig /flushdns",
                    output: <CommandLineProgram>{
                        name: "ipconfig",
                        args: ["/flushdns"]
                    }
                },
                <InputOutputCombination>{
                    input: ">ls -la .",
                    output: <CommandLineProgram>{
                        name: "ls",
                        args: ["-la", "."]
                    }
                },
                <InputOutputCombination>{
                    input: "df -h",
                    output: <CommandLineProgram>{
                        name: "df",
                        args: ["-h"]
                    }
                }
            ]

            for (let combination of combinations) {
                let actual = CommandLineHelpers.buildCommand(combination.input);
                expect(actual.name).to.equal(combination.output.name);
                expect(actual.args.length).to.equal(combination.output.args.length);
                
                for (let i = 0; i < actual.args.length; i++) {
                    expect(actual.args[i]).to.equal(combination.output.args[i]);
                }
            }
        });
    });
});
