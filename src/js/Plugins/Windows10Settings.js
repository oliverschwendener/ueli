import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import StringHelpers from '../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class Windows10Settings {
    constructor() {
        this.icon = 'fa fa-windows'
        this.name = 'Windows 10 Settings'
        this.prefix = 'ms-settings'
        this.windowsApps = getAllWindowsSettings()
    }

    getName() {
        return this.name
    }

    isValid(userInput) {
        for (let windowsApp of this.windowsApps)
            if (this.windowsAppMatchesUserInput(windowsApp, userInput))
                return true

        return false
    }

    execute(execArg) {
        exec(`start ${execArg}`, (err, stdout, stderr) => {
            if (err)
                throw err;
            else
                ipcRenderer.send('hide-main-window')
        })
    }

    getSearchResult(userInput) {
        let result = []

        for (let windowsApp of this.windowsApps) {
            if (this.windowsAppMatchesUserInput(windowsApp, userInput))
                result.push({
                    name: windowsApp.name,
                    execArg: windowsApp.execArg,
                    icon: this.icon
                })
        }

        return result
    }

    tagsMatchesUserInput(tags, userInput) {
        let words = stringHelpers.splitStringToArray(userInput)
        let matchCounter = 0

        if (tags.length === 0) {
            return false
        }
        else {
            for (let tag of tags) {
                for (let word of words) {
                    if (stringHelpers.stringContainsSubstring(tag, word))
                        matchCounter++
                }
            }

            return matchCounter == words.length
        }
    }

    windowsAppMatchesUserInput(windowsApp, userInput) {
        return stringHelpers.stringContainsSubstring(windowsApp.name, userInput)
            || stringHelpers.stringContainsSubstring(windowsApp.execArg, userInput)
            || this.tagsMatchesUserInput(windowsApp.tags, userInput)
    }
}

function getAllWindowsSettings() {
    let result = []

    result = result.concat(getSystemSettings())
    result = result.concat(getDeviceSettings())
    result = result.concat(getNetworkSettings())
    result = result.concat(getPersonalizationSettings())
    result = result.concat(getAppSettings())
    result = result.concat(getAccountSettings())
    result = result.concat(getTimeAndLanguageSettings())
    result = result.concat(getGamingSettings())
    result = result.concat(getEaseOfAccessSettings())
    result = result.concat(getPrivacySettings())
    result = result.concat(getUpdateAndSecurityOptions())
    result = result.concat(getCortanaSettings())
    result = result.concat(getOtherWindowsCommands())

    for (let item of result)
        if (item.tags === undefined)
            item.tags = []

    return result
}

function getSystemSettings() {
    return [
        {
            name: 'Windows Settings',
            execArg: 'ms-settings:',
            tags: ['control', 'panel']
        },
        {
            name: 'Battery Saver',
            execArg: `ms-settings:batterysaver`,
            tags: ['power', 'energy', 'saving', 'save']
        },
        {
            name: 'Battery',
            execArg: `ms-settings:batterysaver`,
            tags: ['power', 'energy', 'saving', 'save']
        },
        {
            name: 'Display',
            execArg: `ms-settings:display`,
            tags: ['screen', 'resolution', '4k', 'hd']
        },
        {
            name: 'Notifications & actions',
            execArg: `ms-settings:notifications`,
            tags: ['notify', 'action']
        },
        {
            name: 'Power & sleep',
            execArg: `ms-settings:powersleep`,
            tags: ['energy', 'plan']
        },
        {
            name: 'Storage',
            execArg: `ms-settings:storagesense`,
            tags: ['hard', 'disk', 'ssd', 'hdd']
        },
        {
            name: 'Tablet mode',
            execArg: `ms-settings://tabletmode/`,
            tags: ['mobile', 'touch']
        },
        {
            name: 'Projecting to this PC',
            execArg: 'ms-settings:project',
        },
        {
            name: 'Multitasking',
            execArg: `ms-settings:multitasking`,
            tags: ['windows', 'window', 'manager', 'snap', 'virtual', 'desktop']
        },
        {
            name: 'Remote Desktop',
            execArg: 'ms-settings:remotedesktop',
            tags: ['connection']
        },
        {
            name: 'About your PC',
            execArg: 'ms-settings:about',
            tags: ['system', 'device', 'specs', 'specifications', 'license', 'info', 'information']
        }
    ]
}

function getDeviceSettings() {
    return [
        {
            name: 'Bluetooth',
            execArg: `ms-settings:bluetooth`,
            tags: ['wireless', 'device', 'devices']
        },
        {
            name: 'Printers & Scanners',
            execArg: 'ms-settings:printers',
            tags: ['devices']
        },
        {
            name: 'Touchpad',
            execArg: `ms-settings:mousetouchpad`,
            tags: ['input']
        },
        {
            name: 'Typing',
            execArg: `ms-settings:typing`,
            tags: ['input', 'keyboard']
        },
        {
            name: 'Pen & Windows Ink',
            execArg: 'ms-settings:pen',
        },
        {
            name: 'Autoplay',
            execArg: 'ms-settings:autoplay',
            tags: ['']
        },
        {
            name: 'USB',
            execArg: 'ms-settings:usb',
            tags: ['devices']
        }
    ]
}

function getNetworkSettings() {
    return [
        {
            name: 'Network status',
            execArg: 'ms-settings:network',
            tags: ['internet']
        },
        {
            name: 'Wi-Fi',
            execArg: `ms-settings:network-wifi`,
            tags: ['network', 'internet', 'wireless']
        },
        {
            name: ':privacy-',
            execArg: `ms-settings:network-:privacy-`,
            tags: ['network', 'internet']
        },
        {
            name: 'Dial-up',
            execArg: `ms-settings:network-dialup`,

        },
        {
            name: 'VPN',
            execArg: `ms-settings:network-vpn`,
            tags: ['vate', 'virtual', 'network', 'vacy']
        },
        {
            name: 'Airplane mode',
            execArg: `ms-settings:network-airplanemode`,
            tags: ['offline']
        },
        {
            name: 'Mobile hotspot',
            execArg: `ms-settings:network-mobilehotspot`,
            tags: ['network', 'internet']
        },
        {
            name: 'Data Usage',
            execArg: `ms-settings:datausage`,
        },
        {
            name: 'Proxy',
            execArg: `ms-settings:network-proxy`,
            tags: ['network']
        }
    ]
}

function getPersonalizationSettings() {
    return [
        {
            name: 'Background',
            execArg: `ms-settings:personalization-background`,
            tags: ['custom', 'customization', 'color', 'colors', 'image', 'picture']
        },
        {
            name: 'Colors',
            execArg: `ms-settings:colors`,
            tags: ['color', 'custom', 'customization', 'creative']
        },
        {
            name: 'Lock screen',
            execArg: `ms-settings:lockscreen`,
            tags: ['screen', 'saver']
        },
        {
            name: 'Themes',
            execArg: `ms-settings:themes`,
            tags: ['custom', 'customization', 'color', 'colors', 'image', 'picture']
        },
        {
            name: 'Start',
            execArg: `ms-settings:personalization-start`,
            tags: ['custom', 'customization', 'search']
        },
        {
            name: 'Taskbar',
            execArg: 'ms-settings:taskbar',

        }
    ]
}

function getAppSettings() {
    return [
        {
            name: 'Apps & features',
            execArg: 'ms-settings:appsfeatures',
            tags: ['programs']
        },
        {
            name: 'Default apps',
            execArg: 'ms-settings:defaultapps',
        },
        {
            name: 'Optional features',
            execArg: `ms-settings:optionalfeatures`,
            tags: ['additional']
        },
        {
            name: 'Offline maps',
            execArg: `ms-settings:maps`,
            tags: ['earth']
        },
        {
            name: 'Apps for websites',
            execArg: 'ms-settings:appsforwebsites',
        },
        {
            name: 'Video playback',
            execArg: 'ms-settings:videoplayback',

        }
    ]
}

function getAccountSettings() {
    return [
        {
            name: 'Your info',
            execArg: 'ms-settings:yourinfo',
            tags: ['account', 'user', 'about']
        },
        {
            name: 'Email & app accounts',
            execArg: 'ms-settings:emailandaccounts',
        },
        {
            name: 'Sign-in options',
            execArg: `ms-settings:signinoptions`,
            tags: ['password', 'change', 'security', 'secret', 'account', 'pin']
        },
        {
            name: 'Access work or school',
            execArg: 'ms-settings:workplace',
        },
        {
            name: 'Family & other users',
            execArg: `ms-settings:otherusers`,
        },
        {
            name: 'Sync your settings',
            execArg: 'ms-settings:sync',

        }
    ]
}

function getTimeAndLanguageSettings() {
    return [
        {
            name: 'Date & Time',
            execArg: `ms-settings:dateandtime`,
            tags: ['clock']
        },
        {
            name: 'Region & language',
            execArg: `ms-settings:regionlanguage`,
            tags: ['locale']
        },
        {
            name: 'Speech',
            execArg: `ms-settings:speech`,

        }
    ]
}

function getGamingSettings() {
    return [
        {
            name: 'Broadcasting',
            execArg: 'ms-settings:gaming-broadcasting',
        },
        {
            name: 'Game bar',
            execArg: 'ms-settings:gaming-',
        },
        {
            name: 'Game DVR',
            execArg: 'ms-settings:gaming-gamedvr',
        },
        {
            name: 'Game Mode',
            execArg: 'ms-settings:gaming-gamemode',
        },
        {
            name: 'TruePlay',
            execArg: 'ms-settings:gaming-trueplay',
        },
        {
            name: 'Xbox Networking',
            execArg: 'ms-settings:gaming-xboxnetworking',

        }
    ]
}

function getEaseOfAccessSettings() {
    let moduleTitle = 'Ease of Access'

    return [
        {
            name: `${moduleTitle}: Narrator`,
            execArg: `ms-settings:easeofaccess-narrator`,
        },
        {
            name: `${moduleTitle}: Magnifier`,
            execArg: `ms-settings:easeofaccess-magnifier`,
        },
        {
            name: `${moduleTitle}: Color & high Contrast`,
            execArg: `ms-settings:easeofaccess-highcontrast`,
        },
        {
            name: `${moduleTitle}: Closed Captioning`,
            execArg: `ms-settings:easeofaccess-closedcaptioning`,
            tags: ['cc']
        },
        {
            name: `${moduleTitle}: Keyboard`,
            execArg: `ms-settings:easeofaccess-keyboard`,
            tags: ['input']
        },
        {
            name: `${moduleTitle}: Mouse`,
            execArg: `ms-settings:easeofaccess-mouse`,
            tags: ['ease', 'of', 'access', 'input']
        },
        {
            name: `${moduleTitle}: Other Options (Ease of Access)`,
            execArg: `ms-settings:easeofaccess-otheroptions`,
        }
    ]
}

function getPrivacySettings() {
    let moduleTitle = 'Privacy'

    return [
        {
            name: `${moduleTitle}: Privacy`,
            execArg: 'ms-settings:privacy-general'
        },
        {
            name: `${moduleTitle}: Location`,
            execArg: `ms-settings:privacy-location`,
            tags: ['gps']
        },
        {
            name: `${moduleTitle}: Camera`,
            execArg: `ms-settings:privacy-webcam`,
            tags: ['web cam']
        },
        {
            name: `${moduleTitle}: Microphone`,
            execArg: `ms-settings:privacy-microphone`,
            tags: ['audio', 'input']
        },
        {
            name: `${moduleTitle}: Notifications`,
            execArg: 'ms-settings:privacy-notifications'
        },
        {
            name: `${moduleTitle}: Speech, ing, & typing`,
            execArg: `ms-settings:privacy-speechtyping`,
        },
        {
            name: `${moduleTitle}: Account info`,
            execArg: `ms-settings:privacy-accountinfo`,
            tags: ['personal', 'vacy', 'user']
        },
        {
            name: `${moduleTitle}: Contacts`,
            execArg: `ms-settings:privacy-contacts`,
            tags: ['people']
        },
        {
            name: `${moduleTitle}: Calendar`,
            execArg: `ms-settings:privacy-calendar`,
            tags: ['day', 'month', 'year']
        },
        {
            name: `${moduleTitle}: Call history`,
            execArg: 'ms-settings:privacy-callhistory',
        },
        {
            name: `${moduleTitle}: Email`,
            execArg: 'ms-settings:privacy-email',
        },
        {
            name: `${moduleTitle}: Tasks`,
            execArg: 'ms-settings:privacy-tasks',
        },
        {
            name: `${moduleTitle}: Messaging`,
            execArg: `ms-settings:privacy-messaging`,
            tags: ['message']
        },
        {
            name: `${moduleTitle}: Radios`,
            execArg: `ms-settings:privacy-radios`,
        },
        {
            name: `${moduleTitle}: Other Devices`,
            execArg: `ms-settings:privacy-customdevices`,
        },
        {
            name: `${moduleTitle}: Feedback & diagnostics`,
            execArg: `ms-settings:privacy-feedback`,
        },
        {
            name: `${moduleTitle}: Background apps`,
            execArg: 'ms-settings:privacy-backgroundapps',
        },
        {
            name: `${moduleTitle}: App diagnostics`,
            execArg: 'ms-settings:privacy-appdiagnostics',
        },
        {
            name: `${moduleTitle}: Automatic file downloads`,
            execArg: 'ms-settings:automaticfiledownloads',
        },
        {
            name: `${moduleTitle}: Motion`,
            execArg: `ms-settings:privacy-motion`,

        }
    ]
}

function getUpdateAndSecurityOptions() {
    return [
        {
            name: 'Windows Update',
            execArg: `ms-settings:windowsupdate`,
            tags: ['patch', 'upgrade', 'security']
        },
        {
            name: 'Windows Defender',
            execArg: 'ms-settings:windowsdefender',
            tags: ['anti', 'virus', 'protection', 'security', 'scan', 'malware']
        },
        {
            name: 'Backup',
            execArg: 'ms-settings:backup',
            tags: ['files', 'storage']
        },
        {
            name: 'Troubleshoot',
            execArg: 'ms-settings:troubleshoot',
        },
        {
            name: 'Recovery',
            execArg: 'ms-settings:recovery',
        },
        {
            name: 'Activation',
            execArg: 'ms-settings:activation',
        },
        {
            name: 'Find my device',
            execArg: 'ms-settings:findmydevice',
        },
        {
            name: 'For developers',
            execArg: `ms-settings:developers`,
            tags: ['dev', 'admin']
        },
        {
            name: 'Windows Insider Program',
            execArg: 'ms-settings:windowsinsider',

        }
    ]
}

function getCortanaSettings() {
    let moduleTitle = 'Cortana'

    return [
        {
            name: `${moduleTitle}: Talk to Cortana`,
            execArg: 'ms-settings:cortana-language',
        },
        {
            name: `${moduleTitle}: More details`,
            execArg: 'ms-settings:cortana-moredetails',
        },
        {
            name: `${moduleTitle}: Notifications`,
            execArg: 'ms-settings:cortana-notifications',

        }
    ]
}

function getOtherWindowsCommands() {
    return [
        {
            name: 'Shutdown',
            execArg: 'shutdown -s -t 0',
            tags: ['power', 'off']
        },
        {
            name: 'Log off',
            execArg: 'shutdown /l',
            tags: ['out', 'off', 'sign', 'user']
        },
        {
            name: 'Windows Version',
            execArg: 'winver',
            tags: ['info', 'release', 'build']
        }
    ]
}