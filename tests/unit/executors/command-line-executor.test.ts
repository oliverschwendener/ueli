import { expect } from "chai";
import { CommandLineExecutor } from "./../../../src/ts/executors/command-line-executor";

describe("command line executor", () => {
    describe("is valid for execution", () => {
        let executor = new CommandLineExecutor();

        it("should return true when passing in a valid command line execution argument", () => {
            let validElectronizrCommands = [
                ">ipconfig",
                ">ipconfig /all"
            ];

            for (let validElectronizrCommand of validElectronizrCommands) {
                let actual = executor.isValidForExecution(validElectronizrCommand);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid command line execution argument", () => {
            let invalidElectronizrCommands = [
                ">",
                "this is some shit",
                "<this is some shit"
            ];

            for (let invalidElectronizrCommmand of invalidElectronizrCommands) {
                let actual = executor.isValidForExecution(invalidElectronizrCommmand);
                expect(actual).to.be.false;
            }
        });
    });
});