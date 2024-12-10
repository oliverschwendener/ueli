import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { AppearanceSwitcherModule } from "./AppearanceSwitcher";
import { ApplicationSearchModule } from "./ApplicationSearch";
import { Base64ConversionModule } from "./Base64Conversion";
import { BrowserBookmarksModule } from "./BrowserBookmarks";
import { CalculatorModule } from "./Calculator";
import { ColorConverterExtensionModule } from "./ColorConverter";
import { CurrencyConversionModule } from "./CurrencyConversion/CurrencyConversionModule";
import { CustomWebSearchModule } from "./CustomWebSearch";
import { DeeplTranslatorModule } from "./DeeplTranslator";
import type { ExtensionModule } from "./ExtensionModule";
import { FileSearchModule } from "./FileSearch/FileSearchModule";
import { JetBrainsToolboxModule } from "./JetBrainsToolbox";
import { SimpleFileSearchExtensionModule } from "./SimpleFileSearch/SimpleFileSearchExtensionModule";
import { SystemCommandsModule } from "./SystemCommands";
import { SystemSettingsModule } from "./SystemSettings";
import { TerminalLauncherModule } from "./TerminalLauncher";
import { UeliCommandModule } from "./UeliCommand";
import { UuidGeneratorModule } from "./UuidGenerator";
import { VSCodeModule } from "./VSCode";
import { WebSearchExtensionModule } from "./WebSearch";
import { WindowsControlPanelModule } from "./WindowsControlPanel";
import { WorkflowExtensionModule } from "./Workflow";

export class ExtensionLoader {
    private static getAllExtensionModules(): ExtensionModule[] {
        /**
         * Here is where all extensions are loaded. Add your extension to this list. Make sure that the items in this
         * list are alphabetically ordered.
         */
        return [
            new AppearanceSwitcherModule(),
            new ApplicationSearchModule(),
            new Base64ConversionModule(),
            new BrowserBookmarksModule(),
            new CalculatorModule(),
            new ColorConverterExtensionModule(),
            new CurrencyConversionModule(),
            new CustomWebSearchModule(),
            new DeeplTranslatorModule(),
            new FileSearchModule(),
            new JetBrainsToolboxModule(),
            new SimpleFileSearchExtensionModule(),
            new SystemCommandsModule(),
            new SystemSettingsModule(),
            new TerminalLauncherModule(),
            new UeliCommandModule(),
            new UuidGeneratorModule(),
            new VSCodeModule(),
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
