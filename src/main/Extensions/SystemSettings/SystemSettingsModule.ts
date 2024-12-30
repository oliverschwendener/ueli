import type { OperatingSystem } from "@common/Core";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { LinuxSystemSettingRepository } from "./LinuxSystemSettingRepository";
import { MacOsSystemSettingRepository } from "./MacOsSystemSettingRepository";
import type { SystemSettingRepository } from "./SystemSettingRepository";
import { SystemSettingsExtension } from "./SystemSettingsExtension";
import { WindowsSystemSettingActionHandler } from "./WindowsSystemSettingActionHandler";
import { WindowsSystemSettingsRepository } from "./WindowsSystemSettingRepository";

export class SystemSettingsModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const systemSettingRepositories: Record<OperatingSystem, SystemSettingRepository> = {
            Linux: new LinuxSystemSettingRepository(),
            macOS: new MacOsSystemSettingRepository(moduleRegistry.get("AssetPathResolver")),
            Windows: new WindowsSystemSettingsRepository(moduleRegistry.get("AssetPathResolver")),
        };

        return {
            extension: new SystemSettingsExtension(
                moduleRegistry.get("OperatingSystem"),
                systemSettingRepositories[moduleRegistry.get("OperatingSystem")],
                moduleRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: [new WindowsSystemSettingActionHandler(moduleRegistry.get("PowershellUtility"))],
        };
    }
}
