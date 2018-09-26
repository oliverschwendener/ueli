import { MacOsSetting } from "./mac-os-setting";
import { MacOsSettingsHelpers } from "../../helpers/mac-os-settings.helpers";
import { SearchResultItem } from "../../search-result-item";

const basePath = "/System/Library/PreferencePanes";

export const systemCommands = [
    {
        executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}osascript -e \'tell app "System Events" to shut down\'`,
        name: "Shutdown",
        tags: ["power", "off"],
    },
    {
        executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}osascript -e \'tell application "System Events" to log out\'`,
        name: "Log out",
        tags: ["sign", "off"],
    },
    {
        executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}osascript -e \'tell app "System Events" to restart\'`,
        name: "Restart",
        tags: ["reboot"],
    },
    {
        executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend`,
        name: "Lock",
        tags: [],
    },
] as SearchResultItem[];

export const allMacOsSettings: MacOsSetting[] = [
    {
        executionArgument: `${basePath}/Accounts.prefPane`,
        name: "Users & Groups",
        tags: ["accounts", "login", "password", "credentials"],
    },
    {
        executionArgument: `${basePath}/AppStore.prefPane`,
        name: "AppStore",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Appearance.prefPane`,
        name: "General",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Bluetooth.prefPane`,
        name: "Bluetooth",
        tags: ["wireless"],
    },
    {
        executionArgument: `${basePath}/DateAndTime.prefPane`,
        name: "Date & Time",
        tags: ["timezone", "clock"],
    },
    {
        executionArgument: `${basePath}/DesktopScreenEffectsPref.prefPane`,
        name: "Desktop & Screensaver",
        tags: ["wallpaper", "background"],
    },
    {
        executionArgument: `${basePath}/DigiHubDiscs.prefPane`,
        name: "CDs & DVDs",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Displays.prefPane`,
        name: "Displays",
        tags: ["monitors", "screen", "resolution", "scaling", "color"],
    },
    {
        executionArgument: `${basePath}/Dock.prefPane`,
        name: "Dock",
        tags: [],
    },
    {
        executionArgument: `${basePath}/EnergySaver.prefPane`,
        name: "Energy Saver",
        tags: ["battery", "power"],
    },
    {
        executionArgument: `${basePath}/Expose.prefPane`,
        name: "Mission Control",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Extensions.prefPane`,
        name: "Extensions",
        tags: [],
    },
    {
        executionArgument: `${basePath}/FibreChannel.prefPane`,
        name: "Fibre Channel",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Ink.prefPane`,
        name: "Ink",
        tags: [],
    },
    {
        executionArgument: `${basePath}/InternetAccounts.prefPane`,
        name: "Internet Accounts",
        tags: ["users", "login", "password"],
    },
    {
        executionArgument: `${basePath}/Keyboard.prefPane`,
        name: "Keyboard",
        tags: ["input", "device", "layout", "language"],
    },
    {
        executionArgument: `${basePath}/Localization.prefPane`,
        name: "Language & Region",
        tags: ["format"],
    },
    {
        executionArgument: `${basePath}/Mouse.prefPane`,
        name: "Mouse",
        tags: ["input"],
    },
    {
        executionArgument: `${basePath}/Network.prefPane`,
        name: "Network",
        tags: ["wifi", "ethernet", "internet"],
    },
    {
        executionArgument: `${basePath}/Notifications.prefPane`,
        name: "Notifications",
        tags: ["alert"],
    },
    {
        executionArgument: `${basePath}/ParentalControls.prefPane`,
        name: "Parental Controls",
        tags: ["security", "children"],
    },
    {
        executionArgument: `${basePath}/PrintAndScan.prefPane`,
        name: "Printers & Scanners",
        tags: ["devices"],
    },
    {
        executionArgument: `${basePath}/Profiles.prefPane`,
        name: "Profiles",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Security.prefPane`,
        name: "Security & Privacy",
        tags: ["firewall", "lock"],
    },
    {
        executionArgument: `${basePath}/SharingPref.prefPane`,
        name: "Sharing",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Sound.prefPane`,
        name: "Sound",
        tags: ["audio", "volume", "microphone"],
    },
    {
        executionArgument: `${basePath}/Speech.prefPane`,
        name: "Siri",
        tags: ["voice"],
    },
    {
        executionArgument: `${basePath}/Spotlight.prefPane`,
        name: "Spotlight",
        tags: ["Search"],
    },
    {
        executionArgument: `${basePath}/StartupDisk.prefPane`,
        name: "Startup Disk",
        tags: ["boot"],
    },
    {
        executionArgument: `${basePath}/TimeMachine.prefPane`,
        name: "Time Machine",
        tags: ["backup"],
    },
    {
        executionArgument: `${basePath}/TouchID.prefPane`,
        name: "Profiles",
        tags: ["fingerprint", "security", "login"],
    },
    {
        executionArgument: `${basePath}/Trackpad.prefPane`,
        name: "Trackpad",
        tags: ["touchpad", "swipe"],
    },
    {
        executionArgument: `${basePath}/UniversalAccessPref.prefPane`,
        name: "Accessibility",
        tags: [],
    },
    {
        executionArgument: `${basePath}/Wallet.prefPane`,
        name: "Wallet",
        tags: ["pay", "appleplay"],
    },
    {
        executionArgument: `${basePath}/iCloudPref.prefPane`,
        name: "iCloud",
        tags: [],
    },
];
