import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { BrowserWindow } from "electron";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { HtmlLoader } from "./HtmlLoader";

describe(HtmlLoader, () => {
    describe(HtmlLoader.prototype.loadHtmlFile, () => {
        it("should load the HTML file from the Vite dev server URL if it is available", async () => {
            const getMock = vi.fn().mockReturnValue("http://localhost:3000");
            const loadURLMock = vi.fn();

            const environmentVariableProvider = <EnvironmentVariableProvider>{ get: (n) => getMock(n) };
            const browserWindow = <BrowserWindow>{ loadURL: (u) => loadURLMock(u) };

            const htmlLoader = new HtmlLoader(environmentVariableProvider);

            await htmlLoader.loadHtmlFile(browserWindow, "index.html");

            expect(loadURLMock).toHaveBeenCalledWith("http://localhost:3000/index.html");
        });

        it("should load the HTML file from the dist-renderer directory if the Vite dev server URL is not available", async () => {
            const getMock = vi.fn().mockReturnValue(undefined);
            const loadFileMock = vi.fn();

            const environmentVariableProvider = <EnvironmentVariableProvider>{ get: (n) => getMock(n) };
            const browserWindow = <BrowserWindow>{ loadFile: (f) => loadFileMock(f) };

            const htmlLoader = new HtmlLoader(environmentVariableProvider);

            await htmlLoader.loadHtmlFile(browserWindow, "index.html");

            expect(loadFileMock).toHaveBeenCalledWith(expect.stringContaining(join("dist-renderer", "index.html")));
        });
    });
});
