import { describe, expect, it } from "vitest";
import { DummyWebBrowser } from "../DummyWebBrowser";
import { WebBrowserRegistry } from "./WebBrowserRegistry";

describe(WebBrowserRegistry, () => {
    it("should return all web browsers", () => {
        const webBrowsers = [
            new DummyWebBrowser("Browser 1"),
            new DummyWebBrowser("Browser 2"),
            new DummyWebBrowser("Browser 3"),
        ];

        expect(new WebBrowserRegistry(webBrowsers).getAll()).toEqual(webBrowsers);
    });

    it("should return the web browser when found by name", () => {
        const browser1 = new DummyWebBrowser("Browser 1");
        const browser2 = new DummyWebBrowser("Browser 2");
        const browser3 = new DummyWebBrowser("Browser 3");

        expect(new WebBrowserRegistry([browser1, browser2, browser3]).getByName("Browser 2")).toBe(browser2);
    });

    it("should return all matching web browsers when searched by name", () => {
        const browser1 = new DummyWebBrowser("Browser 1");
        const browser2 = new DummyWebBrowser("Browser 2");
        const browser3 = new DummyWebBrowser("Browser 3");

        expect(new WebBrowserRegistry([browser1, browser2, browser3]).getByNames(["Browser 1", "Browser 2"])).toEqual([
            browser1,
            browser2,
        ]);
    });
});
