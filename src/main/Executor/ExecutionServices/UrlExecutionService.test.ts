import type { SearchResultItem } from "@common/SearchResultItem";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { UrlExecutionService } from "./UrlExecutionService";

describe(UrlExecutionService, () => {
    it("should call shell's openExternal function", async () => {
        const openExternalMock = vi.fn().mockReturnValue(Promise.resolve());

        const shell = <Shell>{ openExternal: (url) => openExternalMock(url) };
        const searchResultItem = <SearchResultItem>{
            executionServiceArgument: "this is a url",
        };

        await new UrlExecutionService(shell).execute(searchResultItem);

        expect(openExternalMock).toHaveBeenCalledWith(searchResultItem.executionServiceArgument);
    });
});
