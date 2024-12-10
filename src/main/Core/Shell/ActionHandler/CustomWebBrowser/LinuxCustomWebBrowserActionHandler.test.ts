import { describe, expect, it } from "vitest";
import { LinuxCustomWebBrowserActionHandler } from "./LinuxCustomWebBrowserActionHandler";

describe(LinuxCustomWebBrowserActionHandler, () => {
    describe(LinuxCustomWebBrowserActionHandler.prototype.isEnabled, () => {
        it("should return false as it's not supported yet", () => {
            expect(new LinuxCustomWebBrowserActionHandler().isEnabled()).toBe(false);
        });
    });

    describe(LinuxCustomWebBrowserActionHandler.prototype.openUrl, () => {
        it("should throw an error as it's not implemented yet", async () => {
            const actionHandler = new LinuxCustomWebBrowserActionHandler();
            await expect(actionHandler.openUrl()).rejects.toThrow("Not implemented");
        });
    });
});
