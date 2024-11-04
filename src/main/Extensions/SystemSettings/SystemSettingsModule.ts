import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { LinuxSystemSettingRepository } from "./LinuxSystemSettingRepository";
import { MacOsSystemSettingRepository } from "./MacOsSystemSettingRepository";
import type { SystemSettingRepository } from "./SystemSettingRepository";
import { SystemSettingsExtension } from "./SystemSettingsExtension";
import { WindowsSystemSettingActionHandler } from "./WindowsSystemSettingActionHandler";
import { WindowsSystemSettingsRepository } from "./WindowsSystemSettingRepository";

export class SystemSettingsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const systemSettingRepositories: Record<OperatingSystem, SystemSettingRepository> = {
            Linux: new LinuxSystemSettingRepository(),
            macOS: new MacOsSystemSettingRepository(dependencyRegistry.get("AssetPathResolver")),
            Windows: new WindowsSystemSettingsRepository(dependencyRegistry.get("AssetPathResolver")),
        };

        return {
            extension: new SystemSettingsExtension(
                dependencyRegistry.get("OperatingSystem"),
                systemSettingRepositories[dependencyRegistry.get("OperatingSystem")],
                dependencyRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: [new WindowsSystemSettingActionHandler(dependencyRegistry.get("PowershellUtility"))],
        };
    }
}
