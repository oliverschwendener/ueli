import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { FileApplicationRepository } from "../plugins/application-search-plugin/file-application-repository";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { generateMacAppIcons, generateWindowsAppIcons } from "../plugins/application-search-plugin/application-icon-helpers";
import { UeliCommandSearchPlugin } from "../plugins/ueli-command-search-plugin/ueli-command-search-plugin";
import { ShortcutsSearchPlugin } from "../plugins/shorcuts-plugin/shortcuts-search-plugin";
import { isWindows } from "../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { executeUrlWindows, executeUrlMacOs } from "../executors/url-executor";
import { executeFilePathWindows, executeFilePathMacOs } from "../executors/file-path-executor";
import { SearchEngine } from "../search-engine";

const urlExecutor = isWindows(platform()) ? executeUrlWindows : executeUrlMacOs;
const filePathExecutor = isWindows(platform()) ? executeFilePathWindows : executeFilePathMacOs;
const appGenerator = isWindows(platform()) ? generateWindowsAppIcons : generateMacAppIcons;

export const getProductionSearchPlugins = (userConfig: UserConfigOptions): SearchEngine => {
    const plugins = [
        new UeliCommandSearchPlugin(),
        new ShortcutsSearchPlugin(userConfig.shortcutOptions, urlExecutor, filePathExecutor),
        new ApplicationSearchPlugin(
            userConfig.applicationSearchOptions,
            new FileApplicationRepository(
                new ApplicationIconService(appGenerator),
                userConfig.applicationSearchOptions,
            ),
            filePathExecutor),
    ];

    return new SearchEngine(plugins, userConfig);
};
