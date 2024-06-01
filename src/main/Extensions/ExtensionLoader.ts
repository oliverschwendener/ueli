import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { AppearanceSwitcherModule } from "./AppearanceSwitcher";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { BrowserBookmarksModule } from "./BrowserBookmarks";
import { CalculatorModule } from "./Calculator";
import { CurrencyConversionModule } from "./CurrencyConversion/CurrencyConversionModule";
import { DeeplTranslatorModule } from "./DeeplTranslator";
import { ExtensionModule } from "./ExtensionModule";
import { FileSearchModule } from "./FileSearch/FileSearchModule";
import { ShortcutsModule } from "./Shortcuts";
import { SystemCommandsModule } from "./SystemCommands";
import { SystemSettingsModule } from "./SystemSettings";
import { TerminalLauncherModule } from "./TerminalLauncher";
import { UeliCommandModule } from "./UeliCommand";
import { WebSearchExtensionModule } from "./WebSearch";
import { WindowsControlPanelModule } from "./WindowsControlPanel";
import { WorkflowExtensionModule } from "./Workflow";

export class ExtensionLoader {
    private static getAllExtensionModules(): ExtensionModule[] {
        return [
            new AppearanceSwitcherModule(),
            new ApplicationSearchModule(),
            new BrowserBookmarksModule(),
            new CalculatorModule(),
            new CurrencyConversionModule(),
            new DeeplTranslatorModule(),
            new FileSearchModule(),
            new ShortcutsModule(),
            new SystemCommandsModule(),
            new SystemSettingsModule(),
            new TerminalLauncherModule(),
            new UeliCommandModule(),
            new WebSearchExtensionModule(),
            new WindowsControlPanelModule(),
            new WorkflowExtensionModule(),
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
