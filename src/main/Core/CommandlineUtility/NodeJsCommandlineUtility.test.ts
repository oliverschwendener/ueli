import { afterEach, describe, expect, it, vi } from "vitest";
import { NodeJsCommandlineUtility } from "./NodeJsCommandlineUtility";

const execMock = vi.fn();

let error: Error | null = null;
let stdout: string = "output";
let stderr: string | undefined = undefined;

vi.mock("child_process", async (importOriginal) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const original = await importOriginal<typeof import("child_process")>();

    return {
        ...original,
        exec: (command: string, callback: (_: Error | null, __: string, ___?: string) => void) => {
            execMock(command);
            callback(error, stdout, stderr);
        },
    };
});

describe(NodeJsCommandlineUtility, () => {
    describe(NodeJsCommandlineUtility.prototype.executeCommand, () => {
        afterEach(() => {
            vi.clearAllMocks();
            vi.resetAllMocks();
        });

        it("should execute the command and return the stdout if no error occurred", async () => {
            error = null;
            stdout = "output";
            stderr = undefined;

            const output = await new NodeJsCommandlineUtility().executeCommand("test", false, false);

            expect(output).toBe("output");
            expect(execMock).toHaveBeenCalledWith("test");
        });

        it("should execute the command and return the stdout if error occurs but ignore error is set to true", async () => {
            error = new Error("This is a test");
            stdout = "output";
            stderr = undefined;

            const output = await new NodeJsCommandlineUtility().executeCommand("test", false, true);

            expect(output).toBe("output");
            expect(execMock).toHaveBeenCalledWith("test");
        });

        it("should execute the command and return the stdout if stderr occurs but ignore stderr is set to true", async () => {
            error = null;
            stdout = "output";
            stderr = undefined;

            const output = await new NodeJsCommandlineUtility().executeCommand("test", true, false);

            expect(output).toBe("output");
            expect(execMock).toHaveBeenCalledWith("test");
        });

        it("should reject the promise if an error occurs and ignore error is set to false", async () => {
            error = new Error("This is an error");
            stdout = "output";
            stderr = undefined;

            expect(
                async () => await new NodeJsCommandlineUtility().executeCommand("test", false, false),
            ).rejects.toThrow(error.message);

            expect(execMock).toHaveBeenCalledWith("test");
        });

        it("should reject the promise if a std error occurs and ignore std error is set to false", async () => {
            error = null;
            stdout = "output";
            stderr = "This is a std err";

            expect(
                async () => await new NodeJsCommandlineUtility().executeCommand("test", false, false),
            ).rejects.toThrow("This is a std err");

            expect(execMock).toHaveBeenCalledWith("test");
        });
    });
});
