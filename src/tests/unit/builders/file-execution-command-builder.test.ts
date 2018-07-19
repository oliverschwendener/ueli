import { FileExecutionCommandBuilder } from "../../../ts/builders/file-execution-command-builder";

describe(FileExecutionCommandBuilder.name, (): void => {
    describe(FileExecutionCommandBuilder.buildMacOsFileExecutionCommand.name, (): void => {
        it("should build the file execution command correctly for mac os", (): void => {
            const filePath = "/Users/darth.vader/file";
            const expected = `open "${filePath}"`;

            const actual = FileExecutionCommandBuilder.buildMacOsFileExecutionCommand(filePath);

            expect(actual).toBe(expected);
        });
    });

    describe(FileExecutionCommandBuilder.buildWindowsFileExecutionCommand.name, (): void => {
        it("should build the file execution command correctly for windows", (): void => {
            const filePath = "C:\\Users\\darth.vader\\file";
            const expected = `start explorer "${filePath}"`;

            const actual = FileExecutionCommandBuilder.buildWindowsFileExecutionCommand(filePath);

            expect(actual).toBe(expected);
        });
    });
});
