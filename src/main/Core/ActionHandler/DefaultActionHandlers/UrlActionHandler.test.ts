import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { UrlActionHandler } from "./UrlActionHandler";

describe(UrlActionHandler, () => {
    it("should call shell's openExternal function", async () => {
        const openExternalMock = vi.fn().mockReturnValue(Promise.resolve());
        const shell = <Shell>{ openExternal: (url) => openExternalMock(url) };

        const actionHandler = new UrlActionHandler(shell);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "this is a url" });

        expect(openExternalMock).toHaveBeenCalledWith("this is a url");
    });
});
