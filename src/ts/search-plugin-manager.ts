import { Config } from "./config";
import { Injector } from "./injector";
import { OperatingSystem } from "./operating-system";
import { UeliCommandsSearchPlugin } from "./search-plugins/ueli-commands-plugin";
import { HomeFolderSearchPlugin } from "./search-plugins/home-folder-plugin";
import { ProgramsPlugin } from "./search-plugins/programs-plugin";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { Windows10SettingsSearchPlugin } from "./search-plugins/windows-10-settings-plugin";
import { platform } from "os";
import { WindowsProgramRepository } from "./programs-plugin/windows-program-repository";
import { MacOsProgramRepository } from "./programs-plugin/macos-program-repository";

export class SearchPluginManager {
    private plugins: SearchPlugin[];

    public constructor() {
        const programRepo = platform() === "win32"
            ? new WindowsProgramRepository()
            : new MacOsProgramRepository();

        this.plugins = [
            new ProgramsPlugin(programRepo),
            new HomeFolderSearchPlugin(),
            new UeliCommandsSearchPlugin(),
            Injector.getOperatingSystemSettingsPlugin(platform()),
        ];
    }

    public getPlugins(): SearchPlugin[] {
        return this.plugins;
    }
}
