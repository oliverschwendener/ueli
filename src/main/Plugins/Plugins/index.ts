import type { DependencyInjector } from "@common/DependencyInjector";
import type { UeliPlugin } from "@common/UeliPlugin";
import { ApplicationSearchBootstrapper } from "./ApplicationSearch";
import { SystemColorThemeSwitcherBootstrapper } from "./SystemColorThemeSwitcher";

export const getAll = (dependencyInjector: DependencyInjector): UeliPlugin[] => [
    new ApplicationSearchBootstrapper().bootstrap(dependencyInjector),
    new SystemColorThemeSwitcherBootstrapper().bootstrap(dependencyInjector),
];
