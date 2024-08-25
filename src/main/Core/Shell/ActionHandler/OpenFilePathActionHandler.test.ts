import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { OpenFilePathActionHandler } from "./OpenFilePathActionHandler";

describe(OpenFilePathActionHandler, () => {
    it("should call shell's openPath function when executing search result item", async () => {
        const openPathMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const shell = <Shell>{ openPath: (path) => openPathMock(path) };

        const actionHandler = new OpenFilePathActionHandler(shell);

        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "this is a file path" });

        expect(actionHandler.id).toEqual("OpenFilePath");
        expect(openPathMock).toHaveBeenCalledWith("this is a file path");
    });

    it("should throw an error if shell's openPath function returns an error message", async () => {
        const openPathMock = vi.fn().mockReturnValue(Promise.resolve("there was an error"));
        const shell = <Shell>{ openPath: (path) => openPathMock(path) };

        const actionHandler = new OpenFilePathActionHandler(shell);

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{ argument: "this is a file path" }),
        ).rejects.toThrowError("there was an error");
    });
});
