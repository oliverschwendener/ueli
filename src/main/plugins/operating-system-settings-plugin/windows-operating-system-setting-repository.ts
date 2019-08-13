import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { IconType } from "../../../common/icon/icon-type";
import { defaultWindowsOperatingSystemSettingIcon } from "../../../common/icon/default-icons";

const personalizationModuleTitle = "Personalization";
const easeOfAccesModuleTitle = "Ease of Access";
const privacyModuleTitle = "Privacy";
const cortanaModuleTitle = "Cortana";

const windowsOperatingSystemSettingDescription = "Windows 10 Setting";

const windowsGeneralSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Settings",
        tags: ["control", "panel", "options"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:batterysaver`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Battery",
        tags: ["power", "energy"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:display`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Display",
        tags: ["screen", "monitor"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:notifications`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Notifications & actions",
        tags: ["notify"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:powersleep`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Power & sleep",
        tags: ["energy"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:storagesense`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Storage",
        tags: ["disk"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:tabletmode`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Tablet mode",
        tags: ["mobile", "touch"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:project`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Projecting to this PC",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:multitasking`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Multitasking",
        tags: [""],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:remotedesktop`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Remote Desktop",
        tags: ["connection"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:about`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "About your PC",
        tags: ["system", "device", "specifications", "information"],
    },
];

const windowsDeviceSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:bluetooth`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Bluetooth",
        tags: ["wireless", "devices"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:printers`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Printers & Scanners",
        tags: ["devices"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:mousetouchpad`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Touchpad",
        tags: ["input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:typing`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Typing",
        tags: ["input", "keyboard"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:pen`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Pen & Windows Ink",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:autoplay`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Autoplay",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:usb`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "USB",
        tags: ["devices"],
    },
];

const windowsNetworkSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Network status",
        tags: ["internet"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-ethernet`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Ethernet",
        tags: ["network", "internet"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-wifi`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Wi-Fi",
        tags: ["network", "internet", "wireless", "wlan"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-dialup`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Dial-up",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-vpn`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "VPN",
        tags: ["virtual", "network"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-airplanemode`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Airplane mode",
        tags: ["offline"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-mobilehotspot`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Mobile hotspot",
        tags: ["network", "internet"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:datausage`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Data Usage",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-proxy`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Proxy",
        tags: ["network"],
    },
];

const windowsPersonalizationSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:personalization-background`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Background`,
        tags: ["customization", "colors", "images", "pictures", "wallpapers"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:colors`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Colors`,
        tags: ["color", "customization", "creative"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:lockscreen`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Lock screen`,
        tags: ["screen", "saver"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:themes`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Themes`,
        tags: ["customization", "colors", "images", "pictures"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:personalization-start`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Start`,
        tags: ["customization", "search"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:taskbar`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Taskbar`,
        tags: [],
    },
];

const windowsAppSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:appsfeatures`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Apps & features",
        tags: ["programs", "uninstall"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:defaultapps`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Default apps",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:optionalfeatures`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Optional features",
        tags: ["additional"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:maps`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Offline maps",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:appsforwebsites`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Apps for websites",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:videoplayback`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Video playback",
        tags: [],
    },
];

const windowsAccountSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:yourinfo`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Your info",
        tags: ["account", "user", "about"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:emailandaccounts`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Email & app accounts",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:signinoptions`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Sign-in options",
        tags: ["password", "change", "security", "secret", "account", "pin"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:workplace`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Access work or school",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:otherusers`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Family & other users",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:sync`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Sync your settings",
        tags: [],
    },
];

const windowsTimeAndLanguageSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:dateandtime`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Date & Time",
        tags: ["clock"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:regionlanguage`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Region & language",
        tags: ["locale"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:speech`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Speech",
        tags: [],
    },
];

const windowsGetGamingSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-broadcasting`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Broadcasting",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-gamebar`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Game bar",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-gamedvr`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Game DVR",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-gamemode`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Game Mode",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-trueplay`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "TruePlay",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-xboxnetworking`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Xbox Networking",
        tags: [],
    },
];

const windowsEaseOfAccessSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-narrator`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Narrator`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-magnifier`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Magnifier`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-highcontrast`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Color & high Contrast`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-closedcaptioning`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Closed Captioning`,
        tags: ["cc"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-keyboard`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Keyboard`,
        tags: ["input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-mouse`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Mouse`,
        tags: ["input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-otheroptions`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Other Options`,
        tags: [],
    },
];

const windowsPrivacySettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-general`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: General`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-location`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Location`,
        tags: ["gps"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-webcam`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Camera`,
        tags: ["webcam"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-microphone`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Microphone`,
        tags: ["audio", "input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-notifications`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Notifications`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-speechtyping`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Speech, ing, & typing`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-accountinfo`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Account info`,
        tags: ["personal", "user"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-contacts`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Contacts`,
        tags: ["people"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-calendar`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Calendar`,
        tags: ["day", "month", "year"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-callhistory`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Call history`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-email`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Email`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-tasks`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Tasks`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-messaging`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Messaging`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-radios`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Radios`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-customdevices`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Other Devices`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-feedback`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Feedback & diagnostics`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-backgroundapps`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Background apps`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-appdiagnostics`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: App diagnostics`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:automaticfiledownloads`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Automatic file downloads`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-motion`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Motion`,
        tags: [],
    },
];

const windowsUpdateAndSecuritySettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:windowsupdate`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Update",
        tags: ["patch", "upgrade", "security"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:windowsdefender`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Defender",
        tags: ["antivirus", "protection", "security", "scan", "malware"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:backup`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Backup",
        tags: ["files", "storage"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:troubleshoot`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Troubleshoot",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:recovery`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Recovery",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:activation`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Activation",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:findmydevice`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Find my device",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:developers`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "For developers",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:windowsinsider`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Insider Program",
        tags: [],
    },
];

const windowsCortanaSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:cortana-language`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${cortanaModuleTitle}: Talk to Cortana`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:cortana-moredetails`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${cortanaModuleTitle}: More details`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:cortana-notifications`,
        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${cortanaModuleTitle}: Notifications`,
        tags: [],
    },
];

const base = [] as OperatingSystemSetting[];

const allOperatingSystemSettings: OperatingSystemSetting[] = base
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

export class WindowsOperatingSystemSettingRepository implements OperatingSystemSettingRepository {
    public getAll(): Promise<OperatingSystemSetting[]> {
        return new Promise((resolve) => {
            resolve(allOperatingSystemSettings);
        });
    }
}
