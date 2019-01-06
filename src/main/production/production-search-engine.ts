import { UserConfigOptions } from "../../common/config/user-config-options";
import { platform } from "os";
import { executeWindowsApp, executeMacApp } from "../search-plugins/application-search-plugin/application-execution";
import { getWindowsAppIcons, getMacAppIcons } from "../search-plugins/application-search-plugin/application-icon-helpers";
import { ApplicationIconService } from "../search-plugins/application-search-plugin/application-icon-service";
import { FileApplicationRepository } from "../search-plugins/application-search-plugin/file-application-repository";
import { SearchPlugin } from "../search-plugin";
import { ApplicationSearchPlugin } from "../search-plugins/application-search-plugin/application-search-plugin";
import { SearchEngine } from "../search-engine";

export const getProductionSearchEngine = (config: UserConfigOptions): SearchEngine => {
    const executeApplication = platform() === "win32" ? executeWindowsApp : executeMacApp;
    const getAppIcons = platform() === "win32" ? getWindowsAppIcons : getMacAppIcons;
    const applicationIconService = new ApplicationIconService(getAppIcons);
    const applicationFileRepository = new FileApplicationRepository(applicationIconService, config.applicationSearchOptions);
    const plugins: SearchPlugin[] = [
        new ApplicationSearchPlugin(applicationFileRepository, executeApplication),
    ];
    return new SearchEngine(plugins, config.generalOptions);
};
