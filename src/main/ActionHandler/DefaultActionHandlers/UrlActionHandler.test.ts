import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { UrlActionHandler } from "./UrlActionHandler";

describe(UrlActionHandler, () => {
    it("should call shell's openExternal function", async () => {
        const openExternalMock = vi.fn().mockReturnValue(Promise.resolve());

        const shell = <Shell>{ openExternal: (url) => openExternalMock(url) };

        const action = <SearchResultItemAction>{
            argument: "this is a url",
        };

        await new UrlActionHandler(shell).invokeAction(action);

        expect(openExternalMock).toHaveBeenCalledWith(action.argument);
    });
});
