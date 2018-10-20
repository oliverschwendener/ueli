import { WindowsSetting } from "./windows-setting";
import { WindowsSettingsHelpers } from "../../helpers/windows-settings-helpers";

const personalizationModuleTitle = "Personalization";
const easeOfAccesModuleTitle = "Ease of Access";
const privacyModuleTitle = "Privacy";
const cortanaModuleTitle = "Cortana";

const windowsGeneralSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:`,
        name: "Windows Settings",
        tags: ["control", "panel", "options"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:batterysaver`,
        name: "Battery",
        tags: ["power", "energy"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:display`,
        name: "Display",
        tags: ["screen", "monitor"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:notifications`,
        name: "Notifications & actions",
        tags: ["notify"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:powersleep`,
        name: "Power & sleep",
        tags: ["energy"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:storagesense`,
        name: "Storage",
        tags: ["disk"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:tabletmode`,
        name: "Tablet mode",
        tags: ["mobile", "touch"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:project`,
        name: "Projecting to this PC",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:multitasking`,
        name: "Multitasking",
        tags: [""],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:remotedesktop`,
        name: "Remote Desktop",
        tags: ["connection"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:about`,
        name: "About your PC",
        tags: ["system", "device", "specifications", "information"],
    },
];

const windowsDeviceSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:bluetooth`,
        name: "Bluetooth",
        tags: ["wireless", "devices"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:printers`,
        name: "Printers & Scanners",
        tags: ["devices"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:mousetouchpad`,
        name: "Touchpad",
        tags: ["input"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:typing`,
        name: "Typing",
        tags: ["input", "keyboard"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:pen`,
        name: "Pen & Windows Ink",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:autoplay`,
        name: "Autoplay",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:usb`,
        name: "USB",
        tags: ["devices"],
    },
];

const windowsNetworkSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network`,
        name: "Network status",
        tags: ["internet"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-ethernet`,
        name: "Ethernet",
        tags: ["network", "internet"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-wifi`,
        name: "Wi-Fi",
        tags: ["network", "internet", "wireless", "wlan"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-dialup`,
        name: "Dial-up",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-vpn`,
        name: "VPN",
        tags: ["virtual", "network"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-airplanemode`,
        name: "Airplane mode",
        tags: ["offline"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-mobilehotspot`,
        name: "Mobile hotspot",
        tags: ["network", "internet"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:datausage`,
        name: "Data Usage",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:network-proxy`,
        name: "Proxy",
        tags: ["network"],
    },
];

const windowsPersonalizationSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:personalization-background`,
        name: `${personalizationModuleTitle}: Background`,
        tags: ["customization", "colors", "images", "pictures", "wallpapers"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:colors`,
        name: `${personalizationModuleTitle}: Colors`,
        tags: ["color", "customization", "creative"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:lockscreen`,
        name: `${personalizationModuleTitle}: Lock screen`,
        tags: ["screen", "saver"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:themes`,
        name: `${personalizationModuleTitle}: Themes`,
        tags: ["customization", "colors", "images", "pictures"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:personalization-start`,
        name: `${personalizationModuleTitle}: Start`,
        tags: ["customization", "search"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:taskbar`,
        name: `${personalizationModuleTitle}: Taskbar`,
        tags: [],
    },
];

const windowsAppSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:appsfeatures`,
        name: "Apps & features",
        tags: ["programs", "uninstall"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:defaultapps`,
        name: "Default apps",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:optionalfeatures`,
        name: "Optional features",
        tags: ["additional"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:maps`,
        name: "Offline maps",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:appsforwebsites`,
        name: "Apps for websites",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:videoplayback`,
        name: "Video playback",
        tags: [],
    },
];

const windowsAccountSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:yourinfo`,
        name: "Your info",
        tags: ["account", "user", "about"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:emailandaccounts`,
        name: "Email & app accounts",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:signinoptions`,
        name: "Sign-in options",
        tags: ["password", "change", "security", "secret", "account", "pin"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:workplace`,
        name: "Access work or school",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:otherusers`,
        name: "Family & other users",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:sync`,
        name: "Sync your settings",
        tags: [],
    },
];

const windowsTimeAndLanguageSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:dateandtime`,
        name: "Date & Time",
        tags: ["clock"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:regionlanguage`,
        name: "Region & language",
        tags: ["locale"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:speech`,
        name: "Speech",
        tags: [],
    },
];

const windowsGetGamingSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:gaming-broadcasting`,
        name: "Broadcasting",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:gaming-gamebar`,
        name: "Game bar",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:gaming-gamedvr`,
        name: "Game DVR",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:gaming-gamemode`,
        name: "Game Mode",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:gaming-trueplay`,
        name: "TruePlay",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:gaming-xboxnetworking`,
        name: "Xbox Networking",
        tags: [],
    },
];

const windowsEaseOfAccessSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-narrator`,
        name: `${easeOfAccesModuleTitle}: Narrator`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-magnifier`,
        name: `${easeOfAccesModuleTitle}: Magnifier`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-highcontrast`,
        name: `${easeOfAccesModuleTitle}: Color & high Contrast`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-closedcaptioning`,
        name: `${easeOfAccesModuleTitle}: Closed Captioning`,
        tags: ["cc"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-keyboard`,
        name: `${easeOfAccesModuleTitle}: Keyboard`,
        tags: ["input"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-mouse`,
        name: `${easeOfAccesModuleTitle}: Mouse`,
        tags: ["input"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:easeofaccess-otheroptions`,
        name: `${easeOfAccesModuleTitle}: Other Options`,
        tags: [],
    },
];

const windowsPrivacySettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-general`,
        name: `${privacyModuleTitle}: General`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-location`,
        name: `${privacyModuleTitle}: Location`,
        tags: ["gps"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-webcam`,
        name: `${privacyModuleTitle}: Camera`,
        tags: ["webcam"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-microphone`,
        name: `${privacyModuleTitle}: Microphone`,
        tags: ["audio", "input"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-notifications`,
        name: `${privacyModuleTitle}: Notifications`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-speechtyping`,
        name: `${privacyModuleTitle}: Speech, ing, & typing`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-accountinfo`,
        name: `${privacyModuleTitle}: Account info`,
        tags: ["personal", "user"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-contacts`,
        name: `${privacyModuleTitle}: Contacts`,
        tags: ["people"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-calendar`,
        name: `${privacyModuleTitle}: Calendar`,
        tags: ["day", "month", "year"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-callhistory`,
        name: `${privacyModuleTitle}: Call history`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-email`,
        name: `${privacyModuleTitle}: Email`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-tasks`,
        name: `${privacyModuleTitle}: Tasks`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-messaging`,
        name: `${privacyModuleTitle}: Messaging`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-radios`,
        name: `${privacyModuleTitle}: Radios`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-customdevices`,
        name: `${privacyModuleTitle}: Other Devices`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-feedback`,
        name: `${privacyModuleTitle}: Feedback & diagnostics`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-backgroundapps`,
        name: `${privacyModuleTitle}: Background apps`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-appdiagnostics`,
        name: `${privacyModuleTitle}: App diagnostics`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:automaticfiledownloads`,
        name: `${privacyModuleTitle}: Automatic file downloads`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:privacy-motion`,
        name: `${privacyModuleTitle}: Motion`,
        tags: [],
    },
];

const windowsUpdateAndSecuritySettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:windowsupdate`,
        name: "Windows Update",
        tags: ["patch", "upgrade", "security"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:windowsdefender`,
        name: "Windows Defender",
        tags: ["antivirus", "protection", "security", "scan", "malware"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:backup`,
        name: "Backup",
        tags: ["files", "storage"],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:troubleshoot`,
        name: "Troubleshoot",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:recovery`,
        name: "Recovery",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:activation`,
        name: "Activation",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:findmydevice`,
        name: "Find my device",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:developers`,
        name: "For developers",
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:windowsinsider`,
        name: "Windows Insider Program",
        tags: [],
    },
];

const windowsCortanaSettings: WindowsSetting[] = [
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:cortana-language`,
        name: `${cortanaModuleTitle}: Talk to Cortana`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:cortana-moredetails`,
        name: `${cortanaModuleTitle}: More details`,
        tags: [],
    },
    {
        executionArgument: `${WindowsSettingsHelpers.windowsSettingsPrefix}ms-settings:cortana-notifications`,
        name: `${cortanaModuleTitle}: Notifications`,
        tags: [],
    },
];

const base = [] as WindowsSetting[];

export const allWindowsSettings: WindowsSetting[] = base
    .concat(windowsAccountSettings)
    .concat(windowsAppSettings)
    .concat(windowsCortanaSettings)
    .concat(windowsDeviceSettings)
    .concat(windowsEaseOfAccessSettings)
    .concat(windowsGeneralSettings)
    .concat(windowsGetGamingSettings)
    .concat(windowsNetworkSettings)
    .concat(windowsPersonalizationSettings)
    .concat(windowsPrivacySettings)
    .concat(windowsTimeAndLanguageSettings)
    .concat(windowsUpdateAndSecuritySettings);
