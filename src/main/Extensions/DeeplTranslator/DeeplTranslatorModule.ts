import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { Net } from "electron";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { DeeplTranslator } from "./DeeplTranslator";

export class DeeplTranslatorModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const net = dependencyInjector.getInstance<Net>("Net");
        const assetPathResolver = dependencyInjector.getInstance<AssetPathResolver>("AssetPathResolver");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const translator = dependencyInjector.getInstance<Translator>("Translator");

        return { extension: new DeeplTranslator(net, assetPathResolver, settingsManager, translator) };
    }
}
