import { UserConfigOptions } from "../../common/config/user-config-options";
import { platform } from "os";
import { executeWindowsApp, executeMacApp } from "../plugins/application-search-plugin/application-execution";
import { getWindowsAppIcons, getMacAppIcons } from "../plugins/application-search-plugin/application-icon-helpers";
import { ApplicationIconService } from "../plugins/application-search-plugin/application-icon-service";
import { FileApplicationRepository } from "../plugins/application-search-plugin/file-application-repository";
import { SearchPlugin } from "../search-plugin";
import { ApplicationSearchPlugin } from "../plugins/application-search-plugin/application-search-plugin";
import { SearchEngine } from "../search-engine";

const getApplicationSearchPlugin = (os: string, config: UserConfigOptions) => {
    const executeApplication = os === "win32" ? executeWindowsApp : executeMacApp;
    const getAppIcons = os === "win32" ? getWindowsAppIcons : getMacAppIcons;
    const applicationIconService = new ApplicationIconService(getAppIcons);
    const applicationFileRepository = new FileApplicationRepository(applicationIconService, config.applicationSearchOptions);
    return new ApplicationSearchPlugin(applicationFileRepository, executeApplication);
};

export const getProductionSearchEngine = (config: UserConfigOptions): SearchEngine => {
    const plugins: SearchPlugin[] = [
        getApplicationSearchPlugin(platform(), config),
    ];
    return new SearchEngine(plugins, config.generalOptions);
};
