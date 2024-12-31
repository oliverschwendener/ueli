import { teamsDarkTheme, teamsLightTheme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getFluentUiTheme } from "./getFluentUiTheme";

const createWindowStub = ({ themeName }: { themeName: string }) => {
    vi.stubGlobal("window", {
        ContextBridge: {
            getSettingValue: () => themeName,
        },
    });
};

afterEach(() => vi.unstubAllGlobals());

describe(getFluentUiTheme, () => {
    it("should return the default theme when the theme name is not found", () => {
        createWindowStub({ themeName: "Custom" });
        expect(getFluentUiTheme(true)).toEqual(webDarkTheme);
        expect(getFluentUiTheme(false)).toEqual(webLightTheme);
    });

    it("should return the fluent ui web theme when the name is 'Fluent UI Web'", () => {
        createWindowStub({ themeName: "Fluent UI Web" });
        expect(getFluentUiTheme(true)).toEqual(webDarkTheme);
        expect(getFluentUiTheme(false)).toEqual(webLightTheme);
    });

    it("should return the teams theme when the name is 'Microsoft Teams'", () => {
        createWindowStub({ themeName: "Microsoft Teams" });
        expect(getFluentUiTheme(true)).toEqual(teamsDarkTheme);
        expect(getFluentUiTheme(false)).toEqual(teamsLightTheme);
    });
});
