import type { SearchResultItem } from "@common/SearchResultItem";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { FilePathExecutionService } from "./FilePathExecutionService";

describe(FilePathExecutionService, () => {
    it("should call shell's openPath function when executing search result item", async () => {
        const openPathMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const shell = <Shell>{ openPath: (path) => openPathMock(path) };

        const searchResultItem = <SearchResultItem>{
            executionServiceArgument: "this is a file path",
        };

        await new FilePathExecutionService(shell).execute(searchResultItem);

        expect(openPathMock).toHaveBeenCalledWith(searchResultItem.executionServiceArgument);
    });

    it("should throw an error if shell's openPath function returns an error message", async () => {
        const openPathMock = vi.fn().mockReturnValue(Promise.resolve("there was an error"));
        const shell = <Shell>{ openPath: (path) => openPathMock(path) };

        const searchResultItem = <SearchResultItem>{
            executionServiceArgument: "this is a file path",
        };

        await expect(new FilePathExecutionService(shell).execute(searchResultItem)).rejects.toThrowError(
            "there was an error",
        );
    });
});
