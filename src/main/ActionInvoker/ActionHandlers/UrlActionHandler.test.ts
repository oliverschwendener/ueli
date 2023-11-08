import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { UrlExecutionService } from "./UrlActionHandler";

describe(UrlExecutionService, () => {
    it("should call shell's openExternal function", async () => {
        const openExternalMock = vi.fn().mockReturnValue(Promise.resolve());

        const shell = <Shell>{ openExternal: (url) => openExternalMock(url) };

        const action = <SearchResultItemAction>{
            argument: "this is a url",
        };

        await new UrlExecutionService(shell).invoke(action);

        expect(openExternalMock).toHaveBeenCalledWith(action.argument);
    });
});
