import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { MacOsSystemSettingRepository } from "./MacOsSystemSettingRepository";
import { SystemSettingsExtension } from "./SystemSettingsExtension";

export class SystemSettingsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        return {
            extension: new SystemSettingsExtension(
                operatingSystem,
                new MacOsSystemSettingRepository(assetPathResolver),
            ),
        };
    }
}
