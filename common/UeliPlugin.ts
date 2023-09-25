import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginDependencies } from "../electron/main/Plugins";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    readonly supportedOperatingSystems: OperatingSystem[];
    addSearchResultItemsToSearchIndex(): Promise<void>;
    setPluginDependencies(pluginDependencies: PluginDependencies): void;
}
