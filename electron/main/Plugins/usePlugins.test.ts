import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import { join } from "path";
import { describe, expect, it } from "vitest";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import type { Plugin } from "./Plugin";
import type { PluginDependencies } from "./PluginDependencies";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";
import { usePlugins } from "./usePlugins";

const app = <App>{
    getPath: (path) => {
        return {
            home: "home",
            userData: "userData",
        }[path];
    },
};

const searchIndex = <SearchIndex>{};
const settingsManager = <SettingsManager>{};

const pluginDependencies = <PluginDependencies>{
    app,
    pluginCacheFolderPath: join("userData", "PluginCache"),
    searchIndex,
    settingsManager,
};

const testUsePlugins = ({
    operatingSystem,
    expectedPlugins,
}: {
    operatingSystem: OperatingSystem;
    expectedPlugins: Plugin[];
}) => expect(usePlugins({ app, operatingSystem, searchIndex, settingsManager })).toEqual(expectedPlugins);

describe(usePlugins, () => {
    it("should return all macOS plugins when the operating system is macOS", () =>
        testUsePlugins({
            operatingSystem: "macOS",
            expectedPlugins: [new MacOsApplicationSearch(pluginDependencies)],
        }));

    it("should return all Windows plugins when the operating system is Windows", () =>
        testUsePlugins({
            operatingSystem: "Windows",
            expectedPlugins: [new WindowsApplicationSearch(pluginDependencies)],
        }));
});
