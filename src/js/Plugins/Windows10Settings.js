import {
    exec
} from 'child_process'
import {
    ipcRenderer
} from 'electron'
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
                    icon: stringHelpers.stringIsEmptyOrWhitespaces(windowsApp.icon) ? this.icon : windowsApp.icon
                })
        }

        return result
    }

    tagsMatchesUserInput(tags, userInput) {
        let words = stringHelpers.splitStringToArray(userInput)
        let matchCounter = 0

        if (tags.length === 0) {
            return false
        } else {
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
        return stringHelpers.stringContainsSubstring(windowsApp.name, userInput) ||
            stringHelpers.stringContainsSubstring(windowsApp.execArg, userInput) ||
            this.tagsMatchesUserInput(windowsApp.tags, userInput)
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
            name: 'Battery',
            execArg: `ms-settings:batterysaver`,
            tags: ['power', 'energy', 'saving', 'save'],
            icon: 'fa fa-battery-full'
        },
        {
            name: 'Display',
            execArg: `ms-settings:display`,
            tags: ['screen', 'resolution', '4k', 'hd'],
            icon: 'icons8-monitor'
        },
        {
            name: 'Notifications & actions',
            execArg: `ms-settings:notifications`,
            tags: ['notify', 'action'],
            icon: 'icons8-comments'
        },
        {
            name: 'Power & sleep',
            execArg: `ms-settings:powersleep`,
            tags: ['energy', 'plan'],
            icon: 'icons8-electrical'
        },
        {
            name: 'Storage',
            execArg: `ms-settings:storagesense`,
            tags: ['hard', 'disk', 'ssd', 'hdd'],
            icon: 'icons8-hdd'
        },
        {
            name: 'Tablet mode',
            execArg: `ms-settings://tabletmode/`,
            tags: ['mobile', 'touch'],
            icon: 'icons8-ipad'
        },
        {
            name: 'Projecting to this PC',
            execArg: 'ms-settings:project',
            icon: 'fa fa-window-restore'
        },
        {
            name: 'Multitasking',
            execArg: `ms-settings:multitasking`,
            tags: ['windows', 'window', 'manager', 'snap', 'virtual', 'desktop'],
            icon: 'fa fa-window-restore'
        },
        {
            name: 'Remote Desktop',
            execArg: 'ms-settings:remotedesktop',
            tags: ['connection']
        },
        {
            name: 'About your PC',
            execArg: 'ms-settings:about',
            tags: ['system', 'device', 'specs', 'specifications', 'license', 'info', 'information'],
            icon: 'icons8-info'
        }
    ]
}

function getDeviceSettings() {
    return [
        {
            name: 'Bluetooth',
            execArg: `ms-settings:bluetooth`,
            tags: ['wireless', 'device', 'devices'],
            icon: 'fa fa-bluetooth-b'
        },
        {
            name: 'Printers & Scanners',
            execArg: 'ms-settings:printers',
            tags: ['devices'],
            icon: 'fa fa-print'
        },
        {
            name: 'Touchpad',
            execArg: `ms-settings:mousetouchpad`,
            tags: ['input'],
            icon: 'fa fa-hand-o-down'
        },
        {
            name: 'Typing',
            execArg: `ms-settings:typing`,
            tags: ['input', 'keyboard'],
            icon: 'icons8-keyboard'
        },
        {
            name: 'Pen & Windows Ink',
            execArg: 'ms-settings:pen',
            icon: 'icons8-pencil'
        },
        {
            name: 'Autoplay',
            execArg: 'ms-settings:autoplay',
            icon: 'fa fa-play'
        },
        {
            name: 'USB',
            execArg: 'ms-settings:usb',
            tags: ['devices'],
            icon: 'fa fa-usb'
        }
    ]
}

function getNetworkSettings() {
    return [
        {
            name: 'Network status',
            execArg: 'ms-settings:network',
            tags: ['internet'],
            icon: 'fa fa-wifi'
        },
        {
            name: 'Wi-Fi',
            execArg: `ms-settings:network-wifi`,
            tags: ['network', 'internet', 'wireless'],
            icon: 'fa fa-wifi'
        },
        {
            name: 'Dial-up',
            execArg: `ms-settings:network-dialup`,
            icon: 'icons8-phone'
        },
        {
            name: 'VPN',
            execArg: `ms-settings:network-vpn`,
            tags: ['vate', 'virtual', 'network', 'vacy'],
            icon: 'fa fa-wifi'
        },
        {
            name: 'Airplane mode',
            execArg: `ms-settings:network-airplanemode`,
            tags: ['offline'],
            icon: 'icons8-airport'
        },
        {
            name: 'Mobile hotspot',
            execArg: `ms-settings:network-mobilehotspot`,
            tags: ['network', 'internet'],
            icon: 'fa fa-wifi'
        },
        {
            name: 'Data Usage',
            execArg: `ms-settings:datausage`,
            icon: 'icons8-pie-chart'
        },
        {
            name: 'Proxy',
            execArg: `ms-settings:network-proxy`,
            tags: ['network'],
            icon: 'fa fa-wifi'
        }
    ]
}

function getPersonalizationSettings() {
    return [
        {
            name: 'Background',
            execArg: `ms-settings:personalization-background`,
            tags: ['custom', 'customization', 'color', 'colors', 'image', 'picture'],
            icon: 'icons8-picture'
        },
        {
            name: 'Colors',
            execArg: `ms-settings:colors`,
            tags: ['color', 'custom', 'customization', 'creative'],
            icon: 'icons8-brush'
        },
        {
            name: 'Lock screen',
            execArg: `ms-settings:lockscreen`,
            tags: ['screen', 'saver'],
            icon: 'icons8-brush'
        },
        {
            name: 'Themes',
            execArg: `ms-settings:themes`,
            tags: ['custom', 'customization', 'color', 'colors', 'image', 'picture'],
            icon: 'icons8-brush'
        },
        {
            name: 'Start',
            execArg: `ms-settings:personalization-start`,
            tags: ['custom', 'customization', 'search'],
            icon: 'icons8-brush'
        },
        {
            name: 'Taskbar',
            execArg: 'ms-settings:taskbar',
            icon: 'icons8-brush'
        }
    ]
}

function getAppSettings() {
    return [
        {
            name: 'Apps & features',
            execArg: 'ms-settings:appsfeatures',
            tags: ['programs'],
            icon: 'icons8-list'
        },
        {
            name: 'Default apps',
            execArg: 'ms-settings:defaultapps',
            icon: 'icons8-list'
        },
        {
            name: 'Optional features',
            execArg: `ms-settings:optionalfeatures`,
            tags: ['additional'],
            icon: 'icons8-download'
        },
        {
            name: 'Offline maps',
            execArg: `ms-settings:maps`,
            tags: ['earth'],
            icon: 'fa fa-map-o'
        },
        {
            name: 'Apps for websites',
            execArg: 'ms-settings:appsforwebsites',
            icon: 'icons8-upload'
        },
        {
            name: 'Video playback',
            execArg: 'ms-settings:videoplayback',
            icon: 'icons8-video-call'
        }
    ]
}

function getAccountSettings() {
    return [
        {
            name: 'Your info',
            execArg: 'ms-settings:yourinfo',
            tags: ['account', 'user', 'about'],
            icon: 'icons8-info'
        },
        {
            name: 'Email & app accounts',
            execArg: 'ms-settings:emailandaccounts',
            icon: 'fa fa-envelope-o'
        },
        {
            name: 'Sign-in options',
            execArg: `ms-settings:signinoptions`,
            tags: ['password', 'change', 'security', 'secret', 'account', 'pin'],
            icon: 'icons8-key'
        },
        {
            name: 'Access work or school',
            execArg: 'ms-settings:workplace',
            icon: 'icons8-briefcase'
        },
        {
            name: 'Family & other users',
            execArg: `ms-settings:otherusers`,
            icon: 'fa fa-users'
        },
        {
            name: 'Sync your settings',
            execArg: 'ms-settings:sync',
            icon: 'icons8-refresh'
        }
    ]
}

function getTimeAndLanguageSettings() {
    return [
        {
            name: 'Date & Time',
            execArg: `ms-settings:dateandtime`,
            tags: ['clock'],
            icon: 'fa fa-clock-o'
        },
        {
            name: 'Region & language',
            execArg: `ms-settings:regionlanguage`,
            tags: ['locale'],
            icon: 'icons8-translation'
        },
        {
            name: 'Speech',
            execArg: `ms-settings:speech`,
            icon: 'fa fa-comment-o'
        }
    ]
}

function getGamingSettings() {
    let icon = 'icons8-controller'

    return [
        {
            name: 'Broadcasting',
            execArg: 'ms-settings:gaming-broadcasting',
            icon: icon
        },
        {
            name: 'Game bar',
            execArg: 'ms-settings:gaming-gamebar',
            icon: icon
        },
        {
            name: 'Game DVR',
            execArg: 'ms-settings:gaming-gamedvr',
            icon: icon
        },
        {
            name: 'Game Mode',
            execArg: 'ms-settings:gaming-gamemode',
            icon: icon
        },
        {
            name: 'TruePlay',
            execArg: 'ms-settings:gaming-trueplay',
            icon: icon
        },
        {
            name: 'Xbox Networking',
            execArg: 'ms-settings:gaming-xboxnetworking',
            icon: icon
        }
    ]
}

function getEaseOfAccessSettings() {
    let moduleTitle = 'Ease of Access'

    return [
        {
            name: `${moduleTitle}: Narrator`,
            execArg: `ms-settings:easeofaccess-narrator`,
            icon: 'fa fa-comment-o'
        },
        {
            name: `${moduleTitle}: Magnifier`,
            execArg: `ms-settings:easeofaccess-magnifier`,
            icon: 'fa fa-search-plus'
        },
        {
            name: `${moduleTitle}: Color & high Contrast`,
            execArg: `ms-settings:easeofaccess-highcontrast`,
            icon: 'icons8-last-quarter'
        },
        {
            name: `${moduleTitle}: Closed Captioning`,
            execArg: `ms-settings:easeofaccess-closedcaptioning`,
            tags: ['cc'],
            icon: 'fa fa-cc'
        },
        {
            name: `${moduleTitle}: Keyboard`,
            execArg: `ms-settings:easeofaccess-keyboard`,
            tags: ['input'],
            icon: 'icons8-keyboard'
        },
        {
            name: `${moduleTitle}: Mouse`,
            execArg: `ms-settings:easeofaccess-mouse`,
            tags: ['ease', 'of', 'access', 'input'],
            icon: 'fa fa-mouse-pointer'
        },
        {
            name: `${moduleTitle}: Other Options`,
            execArg: `ms-settings:easeofaccess-otheroptions`,
        }
    ]
}

function getPrivacySettings() {
    let moduleTitle = 'Privacy'
    let icon = 'icons8-lock'

    return [
        {
            name: `${moduleTitle}: General`,
            execArg: 'ms-settings:privacy-general',
            icon: icon
        },
        {
            name: `${moduleTitle}: Location`,
            execArg: `ms-settings:privacy-location`,
            tags: ['gps'],
            icon: 'icons8-gps-device'
        },
        {
            name: `${moduleTitle}: Camera`,
            execArg: `ms-settings:privacy-webcam`,
            tags: ['web cam'],
            icon: 'icons8-camera'
        },
        {
            name: `${moduleTitle}: Microphone`,
            execArg: `ms-settings:privacy-microphone`,
            tags: ['audio', 'input'],
            icon: 'fa fa-microphone'
        },
        {
            name: `${moduleTitle}: Notifications`,
            execArg: 'ms-settings:privacy-notifications',
            icon: 'fa fa-bell-o'
        },
        {
            name: `${moduleTitle}: Speech, ing, & typing`,
            execArg: `ms-settings:privacy-speechtyping`,
            icon: 'fa fa-comment-o'
        },
        {
            name: `${moduleTitle}: Account info`,
            execArg: `ms-settings:privacy-accountinfo`,
            tags: ['personal', 'vacy', 'user'],
            icon: 'icons8-info'
        },
        {
            name: `${moduleTitle}: Contacts`,
            execArg: `ms-settings:privacy-contacts`,
            tags: ['people'],
            icon: 'icons8-group'
        },
        {
            name: `${moduleTitle}: Calendar`,
            execArg: `ms-settings:privacy-calendar`,
            tags: ['day', 'month', 'year'],
            icon: 'fa fa-calendar'
        },
        {
            name: `${moduleTitle}: Call history`,
            execArg: 'ms-settings:privacy-callhistory',
            icon: 'icons8-phone'
        },
        {
            name: `${moduleTitle}: Email`,
            execArg: 'ms-settings:privacy-email',
            icon: 'fa fa-envelope-o'
        },
        {
            name: `${moduleTitle}: Tasks`,
            execArg: 'ms-settings:privacy-tasks',
            icon: 'icons8-tasks'
        },
        {
            name: `${moduleTitle}: Messaging`,
            execArg: `ms-settings:privacy-messaging`,
            tags: ['message'],
            icon: 'icons8-comments'
        },
        {
            name: `${moduleTitle}: Radios`,
            execArg: `ms-settings:privacy-radios`,
            icon: 'fa fa-volume-up'
        },
        {
            name: `${moduleTitle}: Other Devices`,
            execArg: `ms-settings:privacy-customdevices`,
            icon: 'icons8-iphone'
        },
        {
            name: `${moduleTitle}: Feedback & diagnostics`,
            execArg: `ms-settings:privacy-feedback`,
            icon: 'fa fa-commenting-o'
        },
        {
            name: `${moduleTitle}: Background apps`,
            execArg: 'ms-settings:privacy-backgroundapps',
            icon: 'fa fa-area-chart'
        },
        {
            name: `${moduleTitle}: App diagnostics`,
            execArg: 'ms-settings:privacy-appdiagnostics',
            icon: 'icons8-area-chart'
        },
        {
            name: `${moduleTitle}: Automatic file downloads`,
            execArg: 'ms-settings:automaticfiledownloads',
            icon: 'icons8-download'
        },
        {
            name: `${moduleTitle}: Motion`,
            execArg: `ms-settings:privacy-motion`,
            icon: icon
        }
    ]
}

function getUpdateAndSecurityOptions() {
    return [
        {
            name: 'Windows Update',
            execArg: `ms-settings:windowsupdate`,
            tags: ['patch', 'upgrade', 'security'],
            icon: 'icons8-refresh'
        },
        {
            name: 'Windows Defender',
            execArg: 'ms-settings:windowsdefender',
            tags: ['anti', 'virus', 'protection', 'security', 'scan', 'malware'],
            icon: 'fa fa-shield'
        },
        {
            name: 'Backup',
            execArg: 'ms-settings:backup',
            tags: ['files', 'storage'],
            icon: 'icons8-hdd'
        },
        {
            name: 'Troubleshoot',
            execArg: 'ms-settings:troubleshoot',
            icon: 'fa fa-bug'
        },
        {
            name: 'Recovery',
            execArg: 'ms-settings:recovery',
            icon: 'icons8-rotate-right'
        },
        {
            name: 'Activation',
            execArg: 'ms-settings:activation',
            icon: 'icons8-checked'
        },
        {
            name: 'Find my device',
            execArg: 'ms-settings:findmydevice',
            icon: 'icons8-gps-device'
        },
        {
            name: 'For developers',
            execArg: `ms-settings:developers`,
            tags: ['dev', 'admin'],
            icon: 'fa fa-code'
        },
        {
            name: 'Windows Insider Program',
            execArg: 'ms-settings:windowsinsider'
        }
    ]
}

function getCortanaSettings() {
    let moduleTitle = 'Cortana'
    let icon = 'icons8-search'

    return [
        {
            name: `${moduleTitle}: Talk to Cortana`,
            execArg: 'ms-settings:cortana-language',
            icon: icon
        },
        {
            name: `${moduleTitle}: More details`,
            execArg: 'ms-settings:cortana-moredetails',
            icon: icon
        },
        {
            name: `${moduleTitle}: Notifications`,
            execArg: 'ms-settings:cortana-notifications',
            icon: icon
        }
    ]
}

function getOtherWindowsCommands() {
    return [
        {
            name: 'Shutdown',
            execArg: 'shutdown -s -t 0',
            tags: ['power', 'off'],
            icon: 'fa fa-power-off'
        },
        {
            name: 'Restart',
            execArg: 'shutdown -r -t 0',
            tags: ['reboot'],
            icon: 'fa fa-repeat'
        },
        {
            name: 'Log off',
            execArg: 'shutdown /l',
            tags: ['out', 'off', 'sign', 'user'],
            icon: 'fa fa-sign-out'
        },
        {
            name: 'Windows Version',
            execArg: 'winver',
            tags: ['info', 'release', 'build'],
            icon: 'icons8-info'
        }
    ]
}