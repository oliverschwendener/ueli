import type { DependencyInjector } from "@common/DependencyInjector";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";

export class PluginModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ApplicationSearchModule.bootstrap(dependencyInjector);
        SystemColorThemeSwitcherModule.bootstrap(dependencyInjector);
    }
}
