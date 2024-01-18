import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { DeeplTranslatorModule } from "./DeeplTranslator";
import { SystemColorThemeSwitcherModule } from "./SystemColorThemeSwitcher";
import { UeliCommandModule } from "./UeliCommand";

export class ExtensionLoader {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const extensionRegistry = dependencyRegistry.get("ExtensionRegistry");
        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");

        for (const bootstrapResult of ExtensionLoader.bootstrapAllExtensions(dependencyRegistry)) {
            extensionRegistry.register(bootstrapResult.extension);

            for (const actionHandler of bootstrapResult.actionHandlers || []) {
                actionHandlerRegistry.register(actionHandler);
            }
        }
    }

    private static bootstrapAllExtensions(dependencyRegistry: DependencyRegistry<Dependencies>) {
        return [
            ApplicationSearchModule.bootstrap(dependencyRegistry),
            DeeplTranslatorModule.bootstrap(dependencyRegistry),
            SystemColorThemeSwitcherModule.bootstrap(dependencyRegistry),
            UeliCommandModule.bootstrap(dependencyRegistry),
        ];
    }
}
