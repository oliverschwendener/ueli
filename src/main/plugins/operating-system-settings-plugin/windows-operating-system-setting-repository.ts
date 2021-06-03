import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { IconType } from "../../../common/icon/icon-type";
import { defaultWindowsOperatingSystemSettingIcon } from "../../../common/icon/default-icons";

const windowsOperatingSystemSettingDescription = "Windows 10 Setting";

interface WindowsSetting {
    name: string;
    URI: string;
}

// copied from here: https://docs.microsoft.com/en-us/windows/uwp/launch-resume/launch-settings-app
const windowsSettings: WindowsSetting[] = [
    // accounts
    { URI: "ms-settings:workplace", name: "Access work or school" },
    { URI: "ms-settings:emailandaccounts", name: "Email & app accounts" },
    { URI: "ms-settings:otherusers", name: "Family & other people" },
    { URI: "ms-settings:assignedaccess", name: "Set up a kiosk" },
    { URI: "ms-settings:signinoptions", name: "Sign-in options" },
    { URI: "ms-settings:sync", name: "Sync your settings" },
    { URI: "ms-settings:signinoptions-launchfaceenrollment", name: "Windows Hello setup (Face)" },
    { URI: "ms-settings:signinoptions-launchfingerprintenrollment", name: "Windows Hello setup (Finger)" },
    { URI: "ms-settings:yourinfo", name: "Your info" },

    // apps
    { URI: "ms-settings:appsfeatures", name: "Apps & Features" },
    { URI: "ms-settings:appsfeatures-app", name: "App features" },
    { URI: "ms-settings:appsforwebsites", name: "Apps for websites" },
    { URI: "ms-settings:defaultapps", name: "Default apps" },
    { URI: "ms-settings:optionalfeatures", name: "Manage optional features" },
    { URI: "ms-settings:maps", name: "Offline Maps" },
    { URI: "ms-settings:startupapps", name: "Startup apps" },
    { URI: "ms-settings:videoplayback", name: "Video playback" },

    // cortana
    { URI: "ms-settings:cortana-notifications", name: "Cortana across my devices" },
    { URI: "ms-settings:cortana-moredetails", name: "More details" },
    { URI: "ms-settings:cortana-permissions", name: "Permissions & History" },
    { URI: "ms-settings:cortana-windowssearch", name: "Searching Windows" },
    { URI: "ms-settings:cortana", name: "Talk to Cortana" },

    // Devices
    { URI: "ms-settings:autoplay", name: "AutoPlay" },
    { URI: "ms-settings:bluetooth", name: "Bluetooth" },
    { URI: "ms-settings:connecteddevices", name: "Connected Devices" },
    { URI: "ms-settings:camera ", name: "Default camera" },
    { URI: "ms-settings:mousetouchpad", name: "Mouse & touchpad" },
    { URI: "ms-settings:pen", name: "Pen & Windows Ink" },
    { URI: "ms-settings:printers", name: "Printers & scanners" },
    { URI: "ms-settings:devices-touchpad", name: "Touchpad" },
    { URI: "ms-settings:typing", name: "Typing" },
    { URI: "ms-settings:usb", name: "USB" },
    { URI: "ms-settings:wheel", name: "Wheel" },
    { URI: "ms-settings:mobile-devices", name: "Your phone" },

    //
    { URI: "ms-settings:easeofaccess-audio", name: "Audio" },
    { URI: "ms-settings:easeofaccess-closedcaptioning", name: "Closed captions" },
    { URI: "ms-settings:easeofaccess-colorfilter", name: "Color filters" },
    { URI: "ms-settings:easeofaccess-cursorandpointersize", name: "Cursor & pointer size" },
    { URI: "ms-settings:easeofaccess-display", name: "Display" },
    { URI: "ms-settings:easeofaccess-eyecontrol", name: "Eye control" },
    { URI: "ms-settings:fonts", name: "Fonts" },
    { URI: "ms-settings:easeofaccess-highcontrast", name: "High contrast" },
    { URI: "ms-settings:easeofaccess-keyboard", name: "Keyboard" },
    { URI: "ms-settings:easeofaccess-magnifier", name: "Magnifier" },
    { URI: "ms-settings:easeofaccess-mouse", name: "Mouse" },
    { URI: "ms-settings:easeofaccess-narrator", name: "Narrator" },
    { URI: "ms-settings:easeofaccess-otheroptions", name: "Other options" },
    { URI: "ms-settings:easeofaccess-speechrecognition", name: "Speech" },

    // Extras
    { URI: "ms-settings:extras", name: "Extras" },

    // Gaming
    { URI: "ms-settings:gaming-broadcasting", name: "Broadcasting" },
    { URI: "ms-settings:gaming-gamebar", name: "Game bar" },
    { URI: "ms-settings:gaming-gamedvr", name: "Game DVR" },
    { URI: "ms-settings:gaming-gamemode", name: "Game Mode" },
    { URI: "ms-settings:quietmomentsgame", name: "Playing a game full screen" },
    { URI: "ms-settings:gaming-trueplay", name: "TruePlay" },
    { URI: "ms-settings:gaming-xboxnetworking", name: "Xbox Networking" },

    // Home page
    { URI: "ms-settings:", name: "Settings home page" },

    // mixed reality
    { URI: "ms-settings:holographic-audio", name: "Audio and speech" },
    { URI: "ms-settings:privacy-holographic-environment", name: "Environment" },
    { URI: "ms-settings:holographic-headset", name: "Headset display" },
    { URI: "ms-settings:holographic-management", name: "Uninstall" },

    // air plane mode
    { URI: "ms-settings:network-airplanemode", name: "Airplane mode" },
    { URI: "ms-settings:network-cellular", name: "Cellular & SIM" },
    { URI: "ms-settings:datausage", name: "Data usage" },
    { URI: "ms-settings:network-dialup", name: "Dial-up" },
    { URI: "ms-settings:network-directaccess", name: "DirectAccess" },
    { URI: "ms-settings:network-ethernet", name: "Ethernet" },
    { URI: "ms-settings:network-wifisettings", name: "Manage known networks" },
    { URI: "ms-settings:network-mobilehotspot", name: "Mobile hotspot" },
    { URI: "ms-settings:nfctransactions", name: "NFC" },
    { URI: "ms-settings:network-proxy", name: "Proxy" },
    { URI: "ms-settings:network", name: "Status" },
    { URI: "ms-settings:network-vpn", name: "VPN" },
    { URI: "ms-settings:network-wifi", name: "Wi-Fi" },
    { URI: "ms-settings:network-wificalling", name: "Wi-Fi Calling" },

    // personalization
    { URI: "ms-settings:personalization-background", name: "Background" },
    { URI: "ms-settings:personalization-start-places", name: "Choose which folders appear on Start" },
    { URI: "ms-settings:personalization-colors", name: "Colors" },
    { URI: "ms-settings:personalization-glance", name: "Glance" },
    { URI: "ms-settings:lockscreen", name: "Lock screen" },
    { URI: "ms-settings:personalization-navbar", name: "Navigation bar" },
    { URI: "ms-settings:personalization", name: "Personalization" },
    { URI: "ms-settings:personalization-start", name: "Start" },
    { URI: "ms-settings:taskbar", name: "Taskbar" },
    { URI: "ms-settings:themes", name: "Themes" },

    // phone
    { URI: "ms-settings:mobile-devices", name: "Your phone" },

    // privacy
    { URI: "ms-settings:privacy-accessoryapps", name: "Accessory apps" },
    { URI: "ms-settings:privacy-accountinfo", name: "Account info" },
    { URI: "ms-settings:privacy-activityhistory", name: "Activity history" },
    { URI: "ms-settings:privacy-advertisingid", name: "Advertising ID" },
    { URI: "ms-settings:privacy-appdiagnostics", name: "App diagnostics" },
    { URI: "ms-settings:privacy-automaticfiledownloads", name: "Automatic file downloads" },
    { URI: "ms-settings:privacy-backgroundapps", name: "Background Apps" },
    { URI: "ms-settings:privacy-calendar", name: "Calendar" },
    { URI: "ms-settings:privacy-callhistory", name: "Call history" },
    { URI: "ms-settings:privacy-webcam", name: "Camera" },
    { URI: "ms-settings:privacy-contacts", name: "Contacts" },
    { URI: "ms-settings:privacy-documents", name: "Documents" },
    { URI: "ms-settings:privacy-email", name: "Email" },
    { URI: "ms-settings:privacy-eyetracker", name: "Eye tracker" },
    { URI: "ms-settings:privacy-feedback", name: "Feedback & diagnostics" },
    { URI: "ms-settings:privacy-broadfilesystemaccess", name: "File system" },
    { URI: "ms-settings:privacy-general", name: "General" },
    { URI: "ms-settings:privacy-location", name: "Location" },
    { URI: "ms-settings:privacy-messaging", name: "Messaging" },
    { URI: "ms-settings:privacy-microphone", name: "Microphone" },
    { URI: "ms-settings:privacy-motion", name: "Motion" },
    { URI: "ms-settings:privacy-notifications", name: "Notifications" },
    { URI: "ms-settings:privacy-customdevices", name: "Other devices" },
    { URI: "ms-settings:privacy-pictures", name: "Pictures" },
    { URI: "ms-settings:privacy-phonecalls", name: "Phone calls" },
    { URI: "ms-settings:privacy-radios", name: "Radios" },
    { URI: "ms-settings:privacy-speechtyping", name: "Speech, inking & typing" },
    { URI: "ms-settings:privacy-tasks", name: "Tasks" },
    { URI: "ms-settings:privacy-videos", name: "Videos" },
    { URI: "ms-settings:privacy-voiceactivation", name: "Voice activation" },

    // surface hub
    { URI: "ms-settings:surfacehub-accounts", name: "Accounts" },
    { URI: "ms-settings:surfacehub-sessioncleanup", name: "Session cleanup" },
    { URI: "ms-settings:surfacehub-calling", name: "Team Conferencing" },
    { URI: "ms-settings:surfacehub-devicemanagenent", name: "Team device management" },
    { URI: "ms-settings:surfacehub-welcome", name: "Welcome screen" },

    // system
    { URI: "ms-settings:about", name: "About" },
    { URI: "ms-settings:display-advanced", name: "Advanced display settings" },
    { URI: "ms-settings:apps-volume", name: "App volume and device preferences" },
    { URI: "ms-settings:batterysaver", name: "Battery Saver" },
    { URI: "ms-settings:batterysaver-settings", name: "Battery Saver settings" },
    { URI: "ms-settings:batterysaver-usagedetails", name: "Battery use" },
    { URI: "ms-settings:clipboard", name: "Clipboard" },
    { URI: "ms-settings:display", name: "Display" },
    { URI: "ms-settings:savelocations", name: "Default Save Locations" },
    { URI: "ms-settings:screenrotation", name: "Display" },
    { URI: "ms-settings:quietmomentspresentation", name: "Duplicating my display" },
    { URI: "ms-settings:quietmomentsscheduled", name: "During these hours" },
    { URI: "ms-settings:deviceencryption", name: "Encryption" },
    { URI: "ms-settings:quiethours", name: "Focus assist" },
    { URI: "ms-settings:display-advancedgraphics", name: "Graphics Settings" },
    { URI: "ms-settings:messaging", name: "Messaging" },
    { URI: "ms-settings:multitasking", name: "Multitasking" },
    { URI: "ms-settings:nightlight", name: "Night light settings" },
    { URI: "ms-settings:phone-defaultapps", name: "Phone" },
    { URI: "ms-settings:project", name: "Projecting to this PC" },
    { URI: "ms-settings:crossdevice", name: "Shared experiences" },
    { URI: "ms-settings:tabletmode", name: "Tablet mode" },
    { URI: "ms-settings:taskbar", name: "Taskbar" },
    { URI: "ms-settings:notifications", name: "Notifications & actions" },
    { URI: "ms-settings:remotedesktop", name: "Remote Desktop" },
    { URI: "ms-settings:phone", name: "Phone" },
    { URI: "ms-settings:powersleep", name: "Power & sleep" },
    { URI: "ms-settings:sound", name: "Sound" },
    { URI: "ms-settings:storagesense", name: "Storage" },
    { URI: "ms-settings:storagepolicies", name: "Storage Sense" },

    // time and language
    { URI: "ms-settings:dateandtime", name: "Date & time" },
    { URI: "ms-settings:keyboard", name: "Keyboard" },
    { URI: "ms-settings:regionlanguage", name: "Language" },
    { URI: "ms-settings:speech", name: "Speech" },

    // update and security
    { URI: "ms-settings:activation", name: "Activation" },
    { URI: "ms-settings:backup", name: "Backup" },
    { URI: "ms-settings:delivery-optimization", name: "Delivery Optimization" },
    { URI: "ms-settings:findmydevice", name: "Find My Device" },
    { URI: "ms-settings:developers", name: "For developers" },
    { URI: "ms-settings:recovery", name: "Recovery" },
    { URI: "ms-settings:troubleshoot", name: "Troubleshoot" },
    { URI: "ms-settings:windowsdefender", name: "Windows Security" },
    { URI: "ms-settings:windowsinsider", name: "Windows Insider Program" },
    { URI: "ms-settings:windowsupdate", name: "Windows Update" },
    { URI: "ms-settings:windowsupdate-options", name: "Windows Update-Advanced options" },
    { URI: "ms-settings:windowsupdate-restartoptions", name: "Windows Update-Restart options" },
    { URI: "ms-settings:windowsupdate-history", name: "Windows Update-View update history" },

    // user accounts
    { URI: "ms-settings:windowsanywhere (device must be Windows Anywhere-capable)", name: "Windows Anywhere" },
];

export class WindowsOperatingSystemSettingRepository implements OperatingSystemSettingRepository {
    public getAll(): Promise<OperatingSystemSetting[]> {
        return new Promise((resolve) => {
            const result = windowsSettings.map(
                (windowsSetting): OperatingSystemSetting => {
                    return {
                        description: windowsOperatingSystemSettingDescription,
                        executionArgument: windowsSetting.URI,
                        icon: { parameter: defaultWindowsOperatingSystemSettingIcon, type: IconType.URL },
                        name: windowsSetting.name,
                        tags: [],
                    };
                },
            );

            resolve(result);
        });
    }
}
