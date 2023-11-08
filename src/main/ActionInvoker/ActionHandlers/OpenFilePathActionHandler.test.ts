import { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { OpenFilePathActionHandler } from "./OpenFilePathActionHandler";

describe(OpenFilePathActionHandler, () => {
    it("should call shell's openPath function when executing search result item", async () => {
        const openPathMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const shell = <Shell>{ openPath: (path) => openPathMock(path) };

        const action = <SearchResultItemAction>{
            argument: "this is a file path",
        };

        await new OpenFilePathActionHandler(shell).invoke(action);

        expect(openPathMock).toHaveBeenCalledWith(action.argument);
    });

    it("should throw an error if shell's openPath function returns an error message", async () => {
        const openPathMock = vi.fn().mockReturnValue(Promise.resolve("there was an error"));
        const shell = <Shell>{ openPath: (path) => openPathMock(path) };

        const action = <SearchResultItemAction>{
            argument: "this is a file path",
        };

        await expect(new OpenFilePathActionHandler(shell).invoke(action)).rejects.toThrowError("there was an error");
    });
});
