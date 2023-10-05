import type { OperatingSystem } from "./OperatingSystem";
import type { PluginDependencies } from "./PluginDependencies";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    readonly supportedOperatingSystems: OperatingSystem[];
    addSearchResultItemsToSearchIndex(): Promise<void>;
    setPluginDependencies(pluginDependencies: PluginDependencies): void;
}
