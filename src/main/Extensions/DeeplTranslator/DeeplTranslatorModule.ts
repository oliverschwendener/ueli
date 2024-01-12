import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Net } from "electron";
import { DeeplTranslator } from "./DeeplTranslator";

export class DeeplTranslatorModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const net = dependencyInjector.getInstance<Net>("Net");

        const extensionAssetPathResolver =
            dependencyInjector.getInstance<ExtensionAssetPathResolver>("ExtensionAssetPathResolver");

        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        dependencyInjector.registerExtension(new DeeplTranslator(net, extensionAssetPathResolver, settingsManager));
    }
}
