import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { FileSearch } from "./FileSearch";
import type { FileSearcher } from "./FileSearcher";
import { LinuxFileSearcher } from "./Linux/LinuxFileSearcher";
import { EverythingFileSearcher } from "./Windows/EverythingFileSearcher";
import { MdfindFileSearcher } from "./macOS/MdfindFileSearcher";

export class FileSearchModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const fileSearchers: Record<OperatingSystem, FileSearcher> = {
            Linux: new LinuxFileSearcher(),
            macOS: new MdfindFileSearcher(moduleRegistry.get("CommandlineUtility")),
            Windows: new EverythingFileSearcher(
                moduleRegistry.get("CommandlineUtility"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("Logger"),
            ),
        };

        return {
            extension: new FileSearch(
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("FileSystemUtility"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("App"),
                moduleRegistry.get("Logger"),
                moduleRegistry.get("Translator"),
                fileSearchers[moduleRegistry.get("OperatingSystem")],
            ),
        };
    }
}
