import type { App } from "electron";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { SearchIndex } from "../SearchIndex";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";
import { usePlugins } from "./usePlugins";

const searchIndex = {} as SearchIndex;

const app = <App>{
    getPath: (path) => {
        return {
            home: "home",
            userData: "userData",
        }[path];
    },
};

describe(usePlugins, () => {
    it("should return all macOS plugins when the operating system is macOS", () =>
        expect(usePlugins(app, "macOS", searchIndex)).toEqual([new MacOsApplicationSearch(searchIndex)]));

    it("should return all macOS plugins when the operating system is macOS", () =>
        expect(usePlugins(app, "Windows", searchIndex)).toEqual([
            new WindowsApplicationSearch(searchIndex, "home", join("userData", "PluginCache")),
        ]));
});
