import type { DependencyInjector } from "../DependencyInjector";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";
import { UeliCommandModule } from "./UeliCommand";

export class ExtensionsModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        ApplicationSearchModule.bootstrap(dependencyInjector);
        SystemColorThemeSwitcherModule.bootstrap(dependencyInjector);
        UeliCommandModule.bootstrap(dependencyInjector);
    }
}
