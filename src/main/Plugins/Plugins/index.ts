import type { UeliPlugin } from "@common/UeliPlugin";
import { ApplicationSearchPlugin } from "./ApplicationSearch";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export const plugins: UeliPlugin[] = [new ApplicationSearchPlugin(), new SystemColorThemeSwitcher()];

export const pluginIdsEnabledByDefault: string[] = ["ApplicationSearch"];
