import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import type { CustomWebBrowserActionHandler } from "./CustomWebBrowser";
import { UrlActionHandler } from "./UrlActionHandler";

describe(UrlActionHandler, () => {
    it("should open the URL with the system's default web browser if the custom web browser action handler is disabled", async () => {
        const openExternalMock = vi.fn().mockReturnValue(Promise.resolve());
        const shell = <Shell>{ openExternal: (url) => openExternalMock(url) };

        const customWebBrowserActionHandler = <CustomWebBrowserActionHandler>{
            isEnabled: () => false,
            openUrl: () => Promise.resolve(),
        };

        const actionHandler = new UrlActionHandler(shell, customWebBrowserActionHandler);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "this is a url" });

        expect(openExternalMock).toHaveBeenCalledWith("this is a url");
    });

    it("should open the URL with the custom web browser aciton handler if it's enabled", async () => {
        const openUrlMock = vi.fn().mockReturnValue(Promise.resolve());

        const customWebBrowserActionHandler = <CustomWebBrowserActionHandler>{
            isEnabled: () => true,
            openUrl: (url) => openUrlMock(url),
        };

        const actionHandler = new UrlActionHandler(<Shell>{}, customWebBrowserActionHandler);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "this is a url" });

        expect(openUrlMock).toHaveBeenCalledWith("this is a url");
    });
});
