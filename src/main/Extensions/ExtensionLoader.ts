import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { AppearanceSwitcherModule } from "./AppearanceSwitcher";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { BrowserBookmarksModule } from "./BrowserBookmarks";
import { CalculatorModule } from "./Calculator";
import { DeeplTranslatorModule } from "./DeeplTranslator";
import { ExtensionModule } from "./ExtensionModule";
import { ShortcutsModule } from "./Shortcuts";
import { SystemSettingsModule } from "./SystemSettings";
import { UeliCommandModule } from "./UeliCommand";
import { WebSearchExtensionModule } from "./WebSearch";

export class ExtensionLoader {
    private static getAllExtensionModules(): ExtensionModule[] {
        return [
            new AppearanceSwitcherModule(),
            new ApplicationSearchModule(),
            new BrowserBookmarksModule(),
            new CalculatorModule(),
            new DeeplTranslatorModule(),
            new ShortcutsModule(),
            new SystemSettingsModule(),
            new UeliCommandModule(),
            new WebSearchExtensionModule(),
        ];
    }

    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const extensionRegistry = dependencyRegistry.get("ExtensionRegistry");
        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");

        const extensionModules = ExtensionLoader.getAllExtensionModules();
        const bootstrapResults = extensionModules.map((e) => e.bootstrap(dependencyRegistry));

        for (const bootstrapResult of bootstrapResults) {
            extensionRegistry.register(bootstrapResult.extension);

            for (const actionHandler of bootstrapResult.actionHandlers || []) {
                actionHandlerRegistry.register(actionHandler);
            }
        }
    }
}
