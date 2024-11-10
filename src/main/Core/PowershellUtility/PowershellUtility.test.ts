import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { RandomStringProvider } from "@Core/RandomStringProvider";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { PowershellUtility } from "./PowershellUtility";

describe(PowershellUtility, () => {
    const testExecuteCommand = async ({ command, options }: { command: string; options?: { maxBuffer: number } }) => {
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

        expect(await powershellUtility.executeCommand(command, options)).toBe("test output");
        expect(executeCommandMock).toHaveBeenCalledWith(
            `${PowershellUtility.PowershellPath} -Command "& {${command}}"`,
        );
    };

    it("should call commandline utility to execute powershell command", async () => {
        await testExecuteCommand({ command: "test command" });
    });

    it("should call commandline utility to execute powershell command with maxBuffer", async () => {
        await testExecuteCommand({ command: "test command", options: { maxBuffer: 100 } });
    });

    const testExecuteScript = async ({ script, options }: { script: string; options?: { maxBuffer: number } }) => {
        const writeTextFileMock = vi.fn().mockReturnValue(Promise.resolve());
        const removeFileMock = vi.fn().mockReturnValue(Promise.resolve());
        const executeCommandMock = vi.fn().mockReturnValue("test output");
        const getRandomHexStringMock = vi.fn().mockReturnValue("randomHexString");

        const fileSystemUtility = <FileSystemUtility>{
            writeTextFile: (data, filePath) => writeTextFileMock(data, filePath),
            removeFile: (filePath) => removeFileMock(filePath),
        };

        const commandlineUtility = <CommandlineUtility>{ executeCommand: (c, o) => executeCommandMock(c, o) };
        const randomStringProvider = <RandomStringProvider>{ getRandomUUid: () => getRandomHexStringMock() };

        const powershellUtility = new PowershellUtility(
            fileSystemUtility,
            commandlineUtility,
            join("temp", "directory"),
            randomStringProvider,
        );

        expect(await powershellUtility.executeScript(script, options)).toBe("test output");

        expect(writeTextFileMock).toHaveBeenCalledWith(
            "\ufeffmy script",
            join("temp", "directory", "randomHexString.ps1"),
        );

        expect(executeCommandMock).toHaveBeenCalledWith(
            `${PowershellUtility.PowershellPath} -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${join("temp", "directory", "randomHexString.ps1")}"`,
            options,
        );

        expect(getRandomHexStringMock).toHaveBeenCalledOnce();
    };

    it("should write a temporary file, execute it and remove the file again", async () => {
        await testExecuteScript({ script: "my script" });
    });

    it("should write a temporary file, execute it and remove the file again, with maxBuffer", async () => {
        await testExecuteScript({ script: "my script", options: { maxBuffer: 100 } });
    });
});
