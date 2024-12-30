import { describe, expect, it } from "vitest";
import { LinuxBrowserWindowConstructorOptionsProvider } from "./LinuxBrowserWindowConstructorOptionsProvider";

describe(LinuxBrowserWindowConstructorOptionsProvider, () => {
    describe(LinuxBrowserWindowConstructorOptionsProvider.prototype.get, () => {
        it("should return an empty object", () =>
            expect(new LinuxBrowserWindowConstructorOptionsProvider({}).get()).toEqual({}));
    });
});
