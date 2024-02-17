import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { SystemSetting } from "./SystemSetting";
import type { SystemSettingRepository } from "./SystemSettingRepository";
import { WindowsSystemSetting } from "./WindowsSystemSetting";

export class WindowsSystemSettingsRepository implements SystemSettingRepository {
    public constructor(private readonly assetPathResolver: AssetPathResolver) {}

    public getAll(): SystemSetting[] {
        return [new WindowsSystemSetting("System Settings", "ms-settings:", this.getGenericImageFilePath())];
    }

    private getGenericImageFilePath(): string {
        return this.assetPathResolver.getExtensionAssetPath("SystemSettings", "windows-11-settings.png");
    }
}
