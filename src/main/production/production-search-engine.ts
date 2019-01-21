import { SearchEngine } from "../search-engine";
import { SearchPlugin } from "../search-plugin";
import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { FileApplicationRepository } from "../plugins/application-search-plugin/file-application-repository";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { getMacAppIcons, getWindowsAppIcons } from "../plugins/application-search-plugin/application-icon-helpers";
import { executeMacApp, executeWindowsApp } from "../plugins/application-search-plugin/application-execution";
import { UeliCommandSearchPlugin } from "../plugins/ueli-command-search-plugin/ueli-command-search-plugin";

const commonProductionSearchPlugins: SearchPlugin[] = [
    new UeliCommandSearchPlugin(),
];

export const getMacOsProductionSearchEngine = (userConfig: UserConfigOptions): SearchEngine => {
    const plugins: SearchPlugin[] = [
        new ApplicationSearchPlugin(
            userConfig.applicationSearchOptions,
            new FileApplicationRepository(
                new ApplicationIconService(getMacAppIcons),
                userConfig.applicationSearchOptions,
            ),
            executeMacApp),
    ];
    return new SearchEngine(plugins.concat(commonProductionSearchPlugins), userConfig);
};

export const getWindowsProductionSearchEngine = (userConfig: UserConfigOptions): SearchEngine => {
    const plugins: SearchPlugin[] = [
        new ApplicationSearchPlugin(
            userConfig.applicationSearchOptions,
            new FileApplicationRepository(
                new ApplicationIconService(getWindowsAppIcons),
                userConfig.applicationSearchOptions,
            ),
            executeWindowsApp),
    ];
    return new SearchEngine(plugins.concat(commonProductionSearchPlugins), userConfig);
};
