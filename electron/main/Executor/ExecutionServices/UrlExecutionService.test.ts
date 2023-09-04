import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { UrlExecutionService } from "./UrlExecutionService";

describe(UrlExecutionService, () => {
    it("should call shell's openExternal function", async () => {
        const openExternalMock = vi.fn().mockReturnValue(Promise.resolve());

        const shell = <Shell>{ openExternal: (url) => openExternalMock(url) };
        const executionArgument = <ExecutionArgument>{
            searchResultItem: {
                executionServiceArgument: "this is a url",
            },
        };

        await new UrlExecutionService(shell).execute(executionArgument);

        expect(openExternalMock).toHaveBeenCalledWith(executionArgument.searchResultItem.executionServiceArgument);
    });
});
