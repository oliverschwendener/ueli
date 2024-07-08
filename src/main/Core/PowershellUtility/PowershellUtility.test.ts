import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { RandomStringProvider } from "@Core/RandomStringProvider";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { PowershellUtility } from "./PowershellUtility";

describe(PowershellUtility, () => {
    it("should call commandline utility to execute powershell command", async () => {
        const executeCommandMock = vi.fn().mockReturnValue("test output");

        const commandlineUtility = <CommandlineUtility>{
            executeCommand: (command) => executeCommandMock(command),
        };

        const powershellUtility = new PowershellUtility(
            <FileSystemUtility>{},
            commandlineUtility,
            "/temp/directory",
            <RandomStringProvider>{},
        );

        expect(await powershellUtility.executeCommand("test command")).toBe("test output");
        expect(executeCommandMock).toHaveBeenCalledWith(
            `${PowershellUtility.PowershellPath} -Command "& {test command}"`,
        );
    });

    it("should write a temporary file, execute it and remove the file again", async () => {
        const writeTextFileMock = vi.fn().mockReturnValue(Promise.resolve());
        const removeFileMock = vi.fn().mockReturnValue(Promise.resolve());
        const executeCommandMock = vi.fn().mockReturnValue("test output");
        const getRandomHexStringMock = vi.fn().mockReturnValue("randomHexString");

        const fileSystemUtility = <FileSystemUtility>{
            writeTextFile: (data, filePath) => writeTextFileMock(data, filePath),
            removeFile: (filePath) => removeFileMock(filePath),
        };

        const commandlineUtility = <CommandlineUtility>{ executeCommand: (command) => executeCommandMock(command) };
        const randomStringProvider = <RandomStringProvider>{ getRandomUUid: () => getRandomHexStringMock() };

        const powershellUtility = new PowershellUtility(
            fileSystemUtility,
            commandlineUtility,
            join("temp", "directory"),
            randomStringProvider,
        );

        expect(await powershellUtility.executeScript("my script")).toBe("test output");
        expect(writeTextFileMock).toHaveBeenCalledWith(
            "\ufeffmy script",
            join("temp", "directory", "randomHexString.ps1"),
        );
        expect(executeCommandMock).toHaveBeenCalledWith(
            `${PowershellUtility.PowershellPath} -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${join("temp", "directory", "randomHexString.ps1")}"`,
        );
        expect(getRandomHexStringMock).toHaveBeenCalledOnce();
    });
});
