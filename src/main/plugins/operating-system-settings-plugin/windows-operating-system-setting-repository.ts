import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { IconType } from "../../../common/icon/icon-type";

const personalizationModuleTitle = "Personalization";
const easeOfAccesModuleTitle = "Ease of Access";
const privacyModuleTitle = "Privacy";
const cortanaModuleTitle = "Cortana";

const windowsOperatingSystemSettingIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTEwLTAzVDIxOjIzOjA4KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTEwLTAzVDIxOjIzOjA4KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMC0wM1QyMToyMzowOCswMjowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NmJkNDc1Ni03OTE0LTUyNDctYmE4OC1jY2JlNmY2NzYwNTkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiZWY5NTc0Ni1kYWRjLTdjNDUtODEyZi05OTA3NGI5NWY3MTYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNjEwMDU3Ny0zNDM4LWVmNDUtOGMwMS04Mzk4MzRhYzI5ZjEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNjEwMDU3Ny0zNDM4LWVmNDUtOGMwMS04Mzk4MzRhYzI5ZjEiIHN0RXZ0OndoZW49IjIwMTgtMTAtMDNUMjE6MjM6MDgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTZiZDQ3NTYtNzkxNC01MjQ3LWJhODgtY2NiZTZmNjc2MDU5IiBzdEV2dDp3aGVuPSIyMDE4LTEwLTAzVDIxOjIzOjA4KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7oExQwAABoNJREFUeNrtnF1sFFUUxwFjSlKMGGgkBInpk/HRF17kwQcTDA+aNj5pQsITDxrtm9VNrVQoNpEEDUmxfAitqNiASB8IpmlQEWmLNina7kc/th22X9jdne123e5011+7pmna3buzH1N3Nmdysy977v/8z39m7pxz78zdtOm9AWmqJhKIQCKQCCQCiUAikAgkAkkTgUQgewr02PsDZY7B8jrnjqOuXcfctJ0Nrm11TvMIGNMl2RcQoAAEtkQE2n3cvb/Ze+iK70Jv4K53nna5L3i43WceAWO6JPsCAhSAwNpboD2N7pe+8L7+lea4NX3xfuCmc04LxhLLx1TIOHVn1jwUxnRJ9gUEKACBBRwXOLKZQFz8T3/shv3ZHv/t4bBP/0+X1cfVBzo3y+MfDKqhMMAM4/UIwAKOCxzhzqo7zgrQJ+uddT/O/DI6/3fYCEUXF4z4+vB6tciRaxN7T3jUUBhghvF6BGABxwWOcIdT2whU0eD6/s+QP2Ik0h8zc0anJ7zv9KgaCgPMMFZA4Qh3OLWTQNf/CgUiiwnl8U8s/ua3D7fXpw1sq2OwqlXDTI2DI9zZSaAnPnS+/cPkTyNhdWCxxXhLt//lc2PpcCqbPDUdU1Ejg0A4wh1ObSMQI+tznw59/uusOjBjMdE1FFY876vbtPZ+HR3VODjCXcbxvuge8+/cmOTiN9LfZwQ+PLtw5p7/wPmxlI2/MFDoAzgucGTLPOiNbx72jEfCC6qRiOC5QCKx1I2/1FcP4LjAkS0FeuGzkYbOR5OhWMKyA3Bc4MiWAlE9HfxynHvEOoEAx8VOi55fVgu0uXbg+ZPDA9NR6wQCHBc4sqVAJCavXrL8CsJFhe2uoC21S/fXa5c0Km9KAesEAhwXOMLdltoiEIiCkJKHM0YjMUuZekCUvyiyW38PJjbkwBHucJpSI0jyV5Iz5LOuabOypmimLKTwIbUneSU9Szk2QxeDlQkKqw8c4Q6nKUdrSEIVA2hDnhCsEmhP49IMBqUzxSHpGQk+KSxJGmkID1rIMVhWLN9ZnFLz6kzosZ9H5lO2CT1mXiOc4rpimQZkoAQx6EESqhCGNuQJIbv5I/OmnKKzPf41YwqOSdVIRnjc8kBhyGRQyBgP9efsvOH1L7hmot/1629dn0zZ+AsDzDDOWLJy4BoC0IAMlCC2pmCGPCEQiCUCof3t4XAourgm2SedJWHjgcJDl18zo7L7UbTtjyCl/L7To89+4uGEp2z8hQFmGNPFzJi9QgNKEFtT6ECeEAikwAIxsO0+7nbcmvbpsQUjns94MR6InesJvHtjiiL+mUbPVkeGChMDzDCmCx3pno93yBMCgRCO2dHajFGZY3B/s/fi/UCeoynkvu4LclE89VHWmQtd6Eh3n55v7UIghFPmGCyYQOV1zkNXfDedc3kya/7N/2LzKBdFDjkLXehId0DypEEghFNuct3JjNGOoy7Gv5U1idyuHQJ75cIYUDlXBnSkOyBA5XMdEQjhAFUwgXYdc9/1zucz7nBrcPLNcsp0toACMJ/xiHAIqlgEYnBl+OAGKUhVuXn5XgMQ2GIRiCfu5b5gDpkxyQuPZx5ADLEFrJWAAhBYwM3kR+uzSsIxO0licmn8cLvv1J3Zqw/0Xi2iXoRZfZDgkcIopuXzacACjguTZKANeUIgEMLZVsBBevX9f+TaRKcnzHmLGpmnREmCSfNIZKwQCFjAcaGe0iVXhCeEoQ35rMfBbJcr9p5Yym6rWrWajqn2fl09qU6hkBx9rBAoORLhQr0o0DUUbun2J7N2yGe9+JEzucomT3WbduaeP92yDKUmxRTlgnWzWYDjIl1NCzHocTdxMyqWJ62dMDtwfiySZpikHKfgtHTCGHBc4CglAYhB73+eURSBRCARSAQSgUQgEajUBCLvIvsiByv+RJFslpw292w+t1KDzJ38nSy++EsN6iGqImqjjSg1VhernB/qwOIvVuFJXW1tsSrTHTJhJlOuxTwnXfqT9rLsIwuHsvRs6dKzvLwgr7/IC1Qb8AKVvIInL3HKa8BWvwYsL5LLpwjyMYt8DiUf1JXKB3XySaZ81GvxZ+FcIO39enWbptj0pWsobGTYn8CGn4Wb3FggasRrOqYqmzyKafmWbn/G7+btt7GA+a0pqlo1xYzH9noXpXwJbk0hm5vI9jiywZJs0SWbvMk2gSWzTaC9m0ggAolAIpAIJAKJQCKQCCRNBBKBCt/+BUfm9nDMpJbxAAAAAElFTkSuQmCC`;

const windowsOperatingSystemSettingDescription = "Windows 10 Setting";

const windowsGeneralSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Settings",
        tags: ["control", "panel", "options"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:batterysaver`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Battery",
        tags: ["power", "energy"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:display`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Display",
        tags: ["screen", "monitor"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:notifications`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Notifications & actions",
        tags: ["notify"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:powersleep`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Power & sleep",
        tags: ["energy"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:storagesense`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Storage",
        tags: ["disk"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:tabletmode`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Tablet mode",
        tags: ["mobile", "touch"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:project`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Projecting to this PC",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:multitasking`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Multitasking",
        tags: [""],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:remotedesktop`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Remote Desktop",
        tags: ["connection"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:about`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "About your PC",
        tags: ["system", "device", "specifications", "information"],
    },
];

const windowsDeviceSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:bluetooth`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Bluetooth",
        tags: ["wireless", "devices"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:printers`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Printers & Scanners",
        tags: ["devices"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:mousetouchpad`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Touchpad",
        tags: ["input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:typing`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Typing",
        tags: ["input", "keyboard"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:pen`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Pen & Windows Ink",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:autoplay`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Autoplay",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:usb`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "USB",
        tags: ["devices"],
    },
];

const windowsNetworkSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Network status",
        tags: ["internet"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-ethernet`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Ethernet",
        tags: ["network", "internet"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-wifi`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Wi-Fi",
        tags: ["network", "internet", "wireless", "wlan"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-dialup`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Dial-up",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-vpn`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "VPN",
        tags: ["virtual", "network"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-airplanemode`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Airplane mode",
        tags: ["offline"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-mobilehotspot`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Mobile hotspot",
        tags: ["network", "internet"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:datausage`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Data Usage",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:network-proxy`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Proxy",
        tags: ["network"],
    },
];

const windowsPersonalizationSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:personalization-background`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Background`,
        tags: ["customization", "colors", "images", "pictures", "wallpapers"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:colors`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Colors`,
        tags: ["color", "customization", "creative"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:lockscreen`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Lock screen`,
        tags: ["screen", "saver"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:themes`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Themes`,
        tags: ["customization", "colors", "images", "pictures"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:personalization-start`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Start`,
        tags: ["customization", "search"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:taskbar`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${personalizationModuleTitle}: Taskbar`,
        tags: [],
    },
];

const windowsAppSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:appsfeatures`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Apps & features",
        tags: ["programs", "uninstall"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:defaultapps`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Default apps",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:optionalfeatures`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Optional features",
        tags: ["additional"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:maps`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Offline maps",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:appsforwebsites`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Apps for websites",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:videoplayback`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Video playback",
        tags: [],
    },
];

const windowsAccountSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:yourinfo`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Your info",
        tags: ["account", "user", "about"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:emailandaccounts`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Email & app accounts",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:signinoptions`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Sign-in options",
        tags: ["password", "change", "security", "secret", "account", "pin"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:workplace`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Access work or school",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:otherusers`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Family & other users",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:sync`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Sync your settings",
        tags: [],
    },
];

const windowsTimeAndLanguageSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:dateandtime`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Date & Time",
        tags: ["clock"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:regionlanguage`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Region & language",
        tags: ["locale"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:speech`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Speech",
        tags: [],
    },
];

const windowsGetGamingSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-broadcasting`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Broadcasting",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-gamebar`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Game bar",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-gamedvr`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Game DVR",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-gamemode`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Game Mode",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-trueplay`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "TruePlay",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:gaming-xboxnetworking`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Xbox Networking",
        tags: [],
    },
];

const windowsEaseOfAccessSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-narrator`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Narrator`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-magnifier`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Magnifier`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-highcontrast`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Color & high Contrast`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-closedcaptioning`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Closed Captioning`,
        tags: ["cc"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-keyboard`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Keyboard`,
        tags: ["input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-mouse`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Mouse`,
        tags: ["input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:easeofaccess-otheroptions`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${easeOfAccesModuleTitle}: Other Options`,
        tags: [],
    },
];

const windowsPrivacySettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-general`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: General`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-location`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Location`,
        tags: ["gps"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-webcam`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Camera`,
        tags: ["webcam"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-microphone`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Microphone`,
        tags: ["audio", "input"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-notifications`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Notifications`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-speechtyping`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Speech, ing, & typing`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-accountinfo`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Account info`,
        tags: ["personal", "user"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-contacts`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Contacts`,
        tags: ["people"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-calendar`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Calendar`,
        tags: ["day", "month", "year"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-callhistory`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Call history`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-email`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Email`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-tasks`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Tasks`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-messaging`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Messaging`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-radios`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Radios`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-customdevices`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Other Devices`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-feedback`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Feedback & diagnostics`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-backgroundapps`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Background apps`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-appdiagnostics`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: App diagnostics`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:automaticfiledownloads`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Automatic file downloads`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:privacy-motion`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${privacyModuleTitle}: Motion`,
        tags: [],
    },
];

const windowsUpdateAndSecuritySettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:windowsupdate`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Update",
        tags: ["patch", "upgrade", "security"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:windowsdefender`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Defender",
        tags: ["antivirus", "protection", "security", "scan", "malware"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:backup`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Backup",
        tags: ["files", "storage"],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:troubleshoot`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Troubleshoot",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:recovery`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Recovery",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:activation`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Activation",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:findmydevice`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Find my device",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:developers`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "For developers",
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:windowsinsider`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: "Windows Insider Program",
        tags: [],
    },
];

const windowsCortanaSettings: OperatingSystemSetting[] = [
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:cortana-language`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${cortanaModuleTitle}: Talk to Cortana`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:cortana-moredetails`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
        name: `${cortanaModuleTitle}: More details`,
        tags: [],
    },
    {
        description: windowsOperatingSystemSettingDescription,
        executionArgument: `ms-settings:cortana-notifications`,
        icon: { parameter: windowsOperatingSystemSettingIcon, type: IconType.URL },
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
