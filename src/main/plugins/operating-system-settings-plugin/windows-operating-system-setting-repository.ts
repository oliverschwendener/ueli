import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { IconType } from "../../../common/icon/icon-type";

const personalizationModuleTitle = "Personalization";
const easeOfAccesModuleTitle = "Ease of Access";
const privacyModuleTitle = "Privacy";
const cortanaModuleTitle = "Cortana";

const windowsGeneralSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Windows Settings",
        tags: ["control", "panel", "options"],
    },
    {
        description: "",
        executionArgument: `ms-settings:batterysaver`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Battery",
        tags: ["power", "energy"],
    },
    {
        description: "",
        executionArgument: `ms-settings:display`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Display",
        tags: ["screen", "monitor"],
    },
    {
        description: "",
        executionArgument: `ms-settings:notifications`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Notifications & actions",
        tags: ["notify"],
    },
    {
        description: "",
        executionArgument: `ms-settings:powersleep`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Power & sleep",
        tags: ["energy"],
    },
    {
        description: "",
        executionArgument: `ms-settings:storagesense`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Storage",
        tags: ["disk"],
    },
    {
        description: "",
        executionArgument: `ms-settings:tabletmode`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Tablet mode",
        tags: ["mobile", "touch"],
    },
    {
        description: "",
        executionArgument: `ms-settings:project`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Projecting to this PC",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:multitasking`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Multitasking",
        tags: [""],
    },
    {
        description: "",
        executionArgument: `ms-settings:remotedesktop`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Remote Desktop",
        tags: ["connection"],
    },
    {
        description: "",
        executionArgument: `ms-settings:about`,
        icon: { parameter: "", type: IconType.SVG },
        name: "About your PC",
        tags: ["system", "device", "specifications", "information"],
    },
];

const windowsDeviceSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:bluetooth`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Bluetooth",
        tags: ["wireless", "devices"],
    },
    {
        description: "",
        executionArgument: `ms-settings:printers`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Printers & Scanners",
        tags: ["devices"],
    },
    {
        description: "",
        executionArgument: `ms-settings:mousetouchpad`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Touchpad",
        tags: ["input"],
    },
    {
        description: "",
        executionArgument: `ms-settings:typing`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Typing",
        tags: ["input", "keyboard"],
    },
    {
        description: "",
        executionArgument: `ms-settings:pen`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Pen & Windows Ink",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:autoplay`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Autoplay",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:usb`,
        icon: { parameter: "", type: IconType.SVG },
        name: "USB",
        tags: ["devices"],
    },
];

const windowsNetworkSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:network`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Network status",
        tags: ["internet"],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-ethernet`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Ethernet",
        tags: ["network", "internet"],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-wifi`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Wi-Fi",
        tags: ["network", "internet", "wireless", "wlan"],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-dialup`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Dial-up",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-vpn`,
        icon: { parameter: "", type: IconType.SVG },
        name: "VPN",
        tags: ["virtual", "network"],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-airplanemode`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Airplane mode",
        tags: ["offline"],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-mobilehotspot`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Mobile hotspot",
        tags: ["network", "internet"],
    },
    {
        description: "",
        executionArgument: `ms-settings:datausage`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Data Usage",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:network-proxy`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Proxy",
        tags: ["network"],
    },
];

const windowsPersonalizationSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:personalization-background`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${personalizationModuleTitle}: Background`,
        tags: ["customization", "colors", "images", "pictures", "wallpapers"],
    },
    {
        description: "",
        executionArgument: `ms-settings:colors`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${personalizationModuleTitle}: Colors`,
        tags: ["color", "customization", "creative"],
    },
    {
        description: "",
        executionArgument: `ms-settings:lockscreen`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${personalizationModuleTitle}: Lock screen`,
        tags: ["screen", "saver"],
    },
    {
        description: "",
        executionArgument: `ms-settings:themes`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${personalizationModuleTitle}: Themes`,
        tags: ["customization", "colors", "images", "pictures"],
    },
    {
        description: "",
        executionArgument: `ms-settings:personalization-start`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${personalizationModuleTitle}: Start`,
        tags: ["customization", "search"],
    },
    {
        description: "",
        executionArgument: `ms-settings:taskbar`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${personalizationModuleTitle}: Taskbar`,
        tags: [],
    },
];

const windowsAppSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:appsfeatures`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Apps & features",
        tags: ["programs", "uninstall"],
    },
    {
        description: "",
        executionArgument: `ms-settings:defaultapps`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Default apps",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:optionalfeatures`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Optional features",
        tags: ["additional"],
    },
    {
        description: "",
        executionArgument: `ms-settings:maps`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Offline maps",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:appsforwebsites`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Apps for websites",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:videoplayback`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Video playback",
        tags: [],
    },
];

const windowsAccountSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:yourinfo`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Your info",
        tags: ["account", "user", "about"],
    },
    {
        description: "",
        executionArgument: `ms-settings:emailandaccounts`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Email & app accounts",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:signinoptions`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Sign-in options",
        tags: ["password", "change", "security", "secret", "account", "pin"],
    },
    {
        description: "",
        executionArgument: `ms-settings:workplace`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Access work or school",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:otherusers`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Family & other users",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:sync`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Sync your settings",
        tags: [],
    },
];

const windowsTimeAndLanguageSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:dateandtime`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Date & Time",
        tags: ["clock"],
    },
    {
        description: "",
        executionArgument: `ms-settings:regionlanguage`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Region & language",
        tags: ["locale"],
    },
    {
        description: "",
        executionArgument: `ms-settings:speech`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Speech",
        tags: [],
    },
];

const windowsGetGamingSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:gaming-broadcasting`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Broadcasting",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:gaming-gamebar`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Game bar",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:gaming-gamedvr`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Game DVR",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:gaming-gamemode`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Game Mode",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:gaming-trueplay`,
        icon: { parameter: "", type: IconType.SVG },
        name: "TruePlay",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:gaming-xboxnetworking`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Xbox Networking",
        tags: [],
    },
];

const windowsEaseOfAccessSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-narrator`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Narrator`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-magnifier`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Magnifier`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-highcontrast`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Color & high Contrast`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-closedcaptioning`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Closed Captioning`,
        tags: ["cc"],
    },
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-keyboard`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Keyboard`,
        tags: ["input"],
    },
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-mouse`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Mouse`,
        tags: ["input"],
    },
    {
        description: "",
        executionArgument: `ms-settings:easeofaccess-otheroptions`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${easeOfAccesModuleTitle}: Other Options`,
        tags: [],
    },
];

const windowsPrivacySettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:privacy-general`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: General`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-location`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Location`,
        tags: ["gps"],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-webcam`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Camera`,
        tags: ["webcam"],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-microphone`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Microphone`,
        tags: ["audio", "input"],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-notifications`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Notifications`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-speechtyping`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Speech, ing, & typing`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-accountinfo`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Account info`,
        tags: ["personal", "user"],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-contacts`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Contacts`,
        tags: ["people"],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-calendar`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Calendar`,
        tags: ["day", "month", "year"],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-callhistory`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Call history`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-email`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Email`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-tasks`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Tasks`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-messaging`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Messaging`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-radios`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Radios`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-customdevices`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Other Devices`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-feedback`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Feedback & diagnostics`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-backgroundapps`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Background apps`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-appdiagnostics`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: App diagnostics`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:automaticfiledownloads`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Automatic file downloads`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:privacy-motion`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${privacyModuleTitle}: Motion`,
        tags: [],
    },
];

const windowsUpdateAndSecuritySettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:windowsupdate`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Windows Update",
        tags: ["patch", "upgrade", "security"],
    },
    {
        description: "",
        executionArgument: `ms-settings:windowsdefender`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Windows Defender",
        tags: ["antivirus", "protection", "security", "scan", "malware"],
    },
    {
        description: "",
        executionArgument: `ms-settings:backup`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Backup",
        tags: ["files", "storage"],
    },
    {
        description: "",
        executionArgument: `ms-settings:troubleshoot`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Troubleshoot",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:recovery`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Recovery",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:activation`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Activation",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:findmydevice`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Find my device",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:developers`,
        icon: { parameter: "", type: IconType.SVG },
        name: "For developers",
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:windowsinsider`,
        icon: { parameter: "", type: IconType.SVG },
        name: "Windows Insider Program",
        tags: [],
    },
];

const windowsCortanaSettings: OperatingSystemSetting[] = [
    {
        description: "",
        executionArgument: `ms-settings:cortana-language`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${cortanaModuleTitle}: Talk to Cortana`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:cortana-moredetails`,
        icon: { parameter: "", type: IconType.SVG },
        name: `${cortanaModuleTitle}: More details`,
        tags: [],
    },
    {
        description: "",
        executionArgument: `ms-settings:cortana-notifications`,
        icon: { parameter: "", type: IconType.SVG },
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
