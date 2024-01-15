import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { describe, expect, it, vi } from "vitest";
import { RandomStringProvider } from "..";
import { PowershellUtility } from "./PowershellUtility";

describe(PowershellUtility, () => {
    it("should call commandline utility to execute powershell command", async () => {
        const executeCommandWithOutputMock = vi.fn().mockReturnValue("test output");

        const commandlineUtility = <CommandlineUtility>{
            executeCommandWithOutput: (command) => executeCommandWithOutputMock(command),
        };

        const powershellUtility = new PowershellUtility(
            <FileSystemUtility>{},
            commandlineUtility,
            "/temp/directory",
            <RandomStringProvider>{},
        );

        expect(await powershellUtility.executeCommand("test command")).toBe("test output");
        expect(executeCommandWithOutputMock).toHaveBeenCalledWith(`powershell -Command "& {test command}"`);
    });

    it("should write a temporary file, execute it and remove the file again", async () => {
        const writeTextFileMock = vi.fn().mockReturnValue(Promise.resolve());
        const removeFileMock = vi.fn().mockReturnValue(Promise.resolve());
        const executeCommandWithOutputMock = vi.fn().mockReturnValue("test output");
        const getRandomHexStringMock = vi.fn().mockReturnValue("randomHexString");

        const fileSystemUtility = <FileSystemUtility>{
            writeTextFile: (data, filePath) => writeTextFileMock(data, filePath),
            removeFile: (filePath) => removeFileMock(filePath),
        };

        const commandlineUtility = <CommandlineUtility>{
            executeCommandWithOutput: (command) => executeCommandWithOutputMock(command),
        };

        const randomStringProvider = <RandomStringProvider>{
            getRandomHexString: (byteLength) => getRandomHexStringMock(byteLength),
        };

        const powershellUtility = new PowershellUtility(
            fileSystemUtility,
            commandlineUtility,
            "/temp/directory",
            randomStringProvider,
        );

        expect(await powershellUtility.executeScript("my script")).toBe("test output");
        expect(writeTextFileMock).toHaveBeenCalledWith("my script", "/temp/directory/randomHexString.ps1");
        expect(executeCommandWithOutputMock).toHaveBeenCalledWith(
            `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "/temp/directory/randomHexString.ps1"`,
        );
        expect(getRandomHexStringMock).toHaveBeenCalledWith(32);
    });
});
