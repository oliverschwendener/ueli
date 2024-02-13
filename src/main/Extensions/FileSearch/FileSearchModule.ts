import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { FileSearch } from "./FileSearch";
import type { FileSearcher } from "./FileSearcher";
import { EverythingFileSearcher } from "./Windows/EverythingFileSearcher";
import { MdfindFileSearcher } from "./macOS/MdfindFileSearcher";

export class FileSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const fileSearchers: Record<OperatingSystem, FileSearcher> = {
            Linux: null, // not supported
            macOS: new MdfindFileSearcher(dependencyRegistry.get("CommandlineUtility")),
            Windows: new EverythingFileSearcher(
                dependencyRegistry.get("CommandlineUtility"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Logger"),
            ),
        };

        return {
            extension: new FileSearch(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("FileSystemUtility"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("App"),
                dependencyRegistry.get("Logger"),
                fileSearchers[dependencyRegistry.get("OperatingSystem")],
            ),
        };
    }
}
