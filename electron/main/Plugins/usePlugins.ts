import type { UeliPlugin } from "../../../common/UeliPlugin";
import { ApplicationSearchPlugin } from "./ApplicationSearch/ApplicationSearchPlugin";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher/SystemColorThemeSwitcher";

export const usePlugins = (): { plugins: UeliPlugin[]; pluginIdsEnabledByDefault: string[] } => {
    return {
        plugins: [new ApplicationSearchPlugin(), new SystemColorThemeSwitcher()],
        pluginIdsEnabledByDefault: ["ApplicationSearch"],
    };
};
