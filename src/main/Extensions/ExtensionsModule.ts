import type { ActionHandlerRegistry } from "@Core/ActionHandler";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionRegistry } from "@Core/ExtensionRegistry";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { DeeplTranslatorModule } from "./DeeplTranslator";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";
import { UeliCommandModule } from "./UeliCommand";

export class ExtensionLoader {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const extensionRegistry = dependencyInjector.getInstance<ExtensionRegistry>("ExtensionRegistry");
        const actionHandlerRegistry = dependencyInjector.getInstance<ActionHandlerRegistry>("ActionHandlerRegistry");

        for (const bootstrapResult of ExtensionLoader.bootstrapAllExtensions(dependencyInjector)) {
            extensionRegistry.register(bootstrapResult.extension);

            for (const actionHandler of bootstrapResult.actionHandlers || []) {
                actionHandlerRegistry.register(actionHandler);
            }
        }
    }

    private static bootstrapAllExtensions(dependencyInjector: DependencyInjector) {
        return [
            ApplicationSearchModule.bootstrap(dependencyInjector),
            DeeplTranslatorModule.bootstrap(dependencyInjector),
            SystemColorThemeSwitcherModule.bootstrap(dependencyInjector),
            UeliCommandModule.bootstrap(dependencyInjector),
        ];
    }
}
