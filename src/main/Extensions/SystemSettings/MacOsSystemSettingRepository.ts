import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { MacOsSystemSetting } from "./MacOsSystemSetting";

export class MacOsSystemSettingRepository {
    public constructor(private readonly assetPathResolver: AssetPathResolver) {}

    public getAll(): MacOsSystemSetting[] {
        return [
            new MacOsSystemSetting(
                "System Settings",
                "/System/Applications/System Settings.app",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Accounts",
                "/System/Library/PreferencePanes/Accounts.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Appearance",
                "/System/Library/PreferencePanes/Appearance.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Apple ID",
                "/System/Library/PreferencePanes/AppleIDPrefPane.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Battery",
                "/System/Library/PreferencePanes/Battery.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Bluetooth",
                "/System/Library/PreferencePanes/Bluetooth.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Date & Time",
                "/System/Library/PreferencePanes/DateAndTime.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Wallpaper",
                "/System/Library/PreferencePanes/DesktopScreenEffectsPref.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Displays",
                "/System/Library/PreferencePanes/Displays.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Dock",
                "/System/Library/PreferencePanes/Dock.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Internet Accounts",
                "/System/Library/PreferencePanes/InternetAccounts.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Keyboard",
                "/System/Library/PreferencePanes/Keyboard.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Localization",
                "/System/Library/PreferencePanes/Localization.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Mouse",
                "/System/Library/PreferencePanes/Mouse.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Network",
                "/System/Library/PreferencePanes/Network.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Notifications",
                "/System/Library/PreferencePanes/Notifications.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Passwords",
                "/System/Library/PreferencePanes/Passwords.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Printers & Scanners",
                "/System/Library/PreferencePanes/PrintAndFax.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Screen Time",
                "/System/Library/PreferencePanes/ScreenTime.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Security",
                "/System/Library/PreferencePanes/Security.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Sound",
                "/System/Library/PreferencePanes/Sound.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Siri & Spotlight",
                "/System/Library/PreferencePanes/Speech.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Touch ID & Password",
                "/System/Library/PreferencePanes/TouchID.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Trackpad",
                "/System/Library/PreferencePanes/Trackpad.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Accessibility",
                "/System/Library/PreferencePanes/UniversalAccessPref.prefPane",
                this.getGenericImageFilePath(),
            ),
            new MacOsSystemSetting(
                "Wallet & Apple Pay",
                "/System/Library/PreferencePanes/Wallet.prefPane",
                this.getGenericImageFilePath(),
            ),
        ];
    }

    private getGenericImageFilePath() {
        return this.assetPathResolver.getExtensionAssetPath("SystemSettings", "macos-system-settings.png");
    }
}
