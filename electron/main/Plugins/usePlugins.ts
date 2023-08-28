import { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import { join } from "path";
import { SearchIndex } from "../SearchIndex";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import { Plugin } from "./Plugin";
import { WindowsApplicationSearch } from "./WindowsApplicationSearch/WindowsApplicationSearch";

export const usePlugins = ({
    app,
    operatingSystem,
    searchIndex,
}: {
    app: App;
    operatingSystem: OperatingSystem;
    searchIndex: SearchIndex;
}): Plugin[] => {
    const pluginMap: Record<OperatingSystem, Plugin[]> = {
        macOS: [new MacOsApplicationSearch(searchIndex)],
        Windows: [
            new WindowsApplicationSearch(
                searchIndex,
                app.getPath("home"),
                join(app.getPath("userData"), "PluginCache"),
            ),
        ],
    };

    return pluginMap[operatingSystem];
};
