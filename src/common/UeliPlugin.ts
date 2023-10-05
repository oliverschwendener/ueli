import type { PluginDependencies } from "../electron/main/Plugins";
import type { OperatingSystem } from "./OperatingSystem";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    readonly supportedOperatingSystems: OperatingSystem[];
    addSearchResultItemsToSearchIndex(): Promise<void>;
    setPluginDependencies(pluginDependencies: PluginDependencies): void;
}
