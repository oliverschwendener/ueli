import { FileLocationExecutionCommandBuilder } from "../../../ts/builders/file-location-execution-command-builder";

describe(FileLocationExecutionCommandBuilder.name, (): void => {
    describe(FileLocationExecutionCommandBuilder.buildMacOsLocationExecutionCommand.name, (): void => {
        it("should build the file location execution command correctly for mac os", (): void => {
            const filePath = "/home/darth.vader/some-file.txt";
            const expected = `open -R "${filePath}"`;

            const actual = FileLocationExecutionCommandBuilder.buildMacOsLocationExecutionCommand(filePath);

            expect(actual).toBe(expected);
        });
    });

    describe(FileLocationExecutionCommandBuilder.buildWindowsLocationExecutionCommand.name, (): void => {
        it("should build the file location execution command correctly for windows", (): void => {
            const filePath = "C:\\Users\\darth.vader\\some-file.txt";
            const expected = `start explorer.exe /select,"${filePath}"`;

            const actual = FileLocationExecutionCommandBuilder.buildWindowsLocationExecutionCommand(filePath);

            expect(actual).toBe(expected);
        });
    });
});
