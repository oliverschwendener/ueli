import type { DependencyInjector } from "../DependencyInjector";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";

export class ExtensionsModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ApplicationSearchModule.bootstrap(dependencyInjector);
        SystemColorThemeSwitcherModule.bootstrap(dependencyInjector);
    }
}
