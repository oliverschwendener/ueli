import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import StringHelpers from '../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class Windows10Settings {
    constructor() {
        this.icon = 'fa fa-windows'
        this.name = 'Windows 10 Settings'
        this.prefix = 'ms-settings'
        this.windowsApps = [
            {
                name: 'Battery Saver',
                execArg: `ms-settings:batterysaver`,
                tags: ['power', 'energy', 'saving', 'save']
            },
            {
                name: 'Battery use',
                execArg: `ms-settings:batterysaver-usagedetails`,
                tags: ['power', 'energy', 'saving', 'save']
            },
            {
                name: 'Battery Saver Settings',
                execArg: `ms-settings:batterysaver-settings`,
                tags: ['power', 'energy', 'saving', 'save']
            },
            {
                name: 'Bluetooth',
                execArg: `ms-settings:bluetooth`,
                tags: ['wireless', 'device', 'devices']
            },
            {
                name: 'Colors',
                execArg: `ms-settings:colors`,
                tags: ['color', 'custom', 'customization', 'creative']
            },
            {
                name: 'Data Usage',
                execArg: `ms-settings:datausage`,
                tags: []
            },
            {
                name: 'Date and Time',
                execArg: `ms-settings:dateandtime`,
                tags: ['clock']
            },
            {
                name: 'Closed Captioning',
                execArg: `ms-settings:easeofaccess-closedcaptioning`,
                tags: ['cc']
            },
            {
                name: 'High Contrast',
                execArg: `ms-settings:easeofaccess-highcontrast`,
                tags: ['ease', 'of', 'access']
            },
            {
                name: 'Magnifier',
                execArg: `ms-settings:easeofaccess-magnifier`,
                tags: ['ease', 'of', 'access']
            },
            {
                name: 'Narrator',
                execArg: `ms-settings:easeofaccess-narrator`,
                tags: ['ease', 'of', 'access']
            },
            {
                name: 'Keyboard',
                execArg: `ms-settings:easeofaccess-keyboard`,
                tags: ['ease', 'of', 'access', 'input']
            },
            {
                name: 'Mouse',
                execArg: `ms-settings:easeofaccess-mouse`,
                tags: ['ease', 'of', 'access', 'input']
            },
            {
                name: 'Other Options (Ease of Access)',
                execArg: `ms-settings:easeofaccess-otheroptions`,
                tags: []
            },
            {
                name: 'Lockscreen',
                execArg: `ms-settings:lockscreen`,
                tags: ['screen', 'saver']
            },
            {
                name: 'Offline maps',
                execArg: `ms-settings:maps`,
                tags: ['earth']
            },
            {
                name: 'Airplane mode',
                execArg: `ms-settings:network-airplanemode`,
                tags: ['offline']
            },
            {
                name: 'Proxy',
                execArg: `ms-settings:network-proxy`,
                tags: ['network']
            },
            {
                name: 'VPN',
                execArg: `ms-settings:network-vpn`,
                tags: ['private', 'virtual', 'network', 'privacy']
            },
            {
                name: 'Notifications & actions',
                execArg: `ms-settings:notifications`,
                tags: ['notify', 'action']
            },
            {
                name: 'Account info',
                execArg: `ms-settings:privacy-accountinfo`,
                tags: ['personal', 'privacy', 'user']
            },
            {
                name: 'Calendar',
                execArg: `ms-settings:privacy-calendar`,
                tags: ['day', 'month', 'year']
            },
            {
                name: 'Contacts',
                execArg: `ms-settings:privacy-contacts`,
                tags: ['people']
            },
            {
                name: 'Other Devices',
                execArg: `ms-settings:privacy-customdevices`,
                tags: []
            },
            {
                name: 'Feedback',
                execArg: `ms-settings:privacy-feedback`,
                tags: []
            },
            {
                name: 'Location',
                execArg: `ms-settings:privacy-location`,
                tags: ['gps']
            },
            {
                name: 'Messaging',
                execArg: `ms-settings:privacy-messaging`,
                tags: ['message']
            },
            {
                name: 'Microphone',
                execArg: `ms-settings:privacy-microphone`,
                tags: ['audio', 'input']
            },
            {
                name: 'Motion',
                execArg: `ms-settings:privacy-motion`,
                tags: []
            },
            {
                name: 'Radios',
                execArg: `ms-settings:privacy-radios`,
                tags: []
            },
            {
                name: 'Speech, inking, & typing',
                execArg: `ms-settings:privacy-speechtyping`,
                tags: []
            },
            {
                name: 'Camera',
                execArg: `ms-settings:privacy-webcam`,
                tags: ['web cam']
            },
            {
                name: 'Region & language',
                execArg: `ms-settings:regionlanguage`,
                tags: ['locale']
            },
            {
                name: 'Speech',
                execArg: `ms-settings:speech`,
                tags: []
            },
            {
                name: 'Windows Update',
                execArg: `ms-settings:windowsupdate`,
                tags: ['patch', 'upgrade', 'security']
            },
            {
                name: 'Work access',
                execArg: `ms-settings:workplace`,
                tags: []
            },
            {
                name: 'Connected devices',
                execArg: `ms-settings:connecteddevices`,
                tags: []
            },
            {
                name: 'For developers',
                execArg: `ms-settings:developers`,
                tags: ['dev', 'admin']
            },
            {
                name: 'Display',
                execArg: `ms-settings:display`,
                tags: ['screen', 'resolution', '4k', 'hd']
            },
            {
                name: 'Mouse & touchpad',
                execArg: `ms-settings:mousetouchpad`,
                tags: ['input']
            },
            {
                name: 'Cellular',
                execArg: `ms-settings:network-cellular`,
                tags: ['network']
            },
            {
                name: 'Dial-up',
                execArg: `ms-settings:network-dialup`,
                tags: []
            },
            {
                name: 'DirectAccess',
                execArg: `ms-settings:network-directaccess`,
                tags: []
            },
            {
                name: 'Ethernet',
                execArg: `ms-settings:network-ethernet`,
                tags: ['network', 'internet']
            },
            {
                name: 'Mobile hotspot',
                execArg: `ms-settings:network-mobilehotspot`,
                tags: ['network', 'internet']
            },
            {
                name: 'Wi-Fi',
                execArg: `ms-settings:network-wifi`,
                tags: ['network', 'internet', 'wireless']
            },
            {
                name: 'Manage Wi-Fi Settings',
                execArg: `ms-settings:network-wifisettings`,
                tags: ['network', 'internet', 'wireless']
            },
            {
                name: 'Optional features',
                execArg: `ms-settings:optionalfeatures`,
                tags: ['additional']
            },
            {
                name: 'Family & other users',
                execArg: `ms-settings:otherusers`,
                tags: []
            },
            {
                name: 'Personalization',
                execArg: `ms-settings:personalization`,
                tags: ['custom', 'customization', 'color', 'colors']
            },
            {
                name: 'Backgrounds',
                execArg: `ms-settings:personalization-background`,
                tags: ['custom', 'customization', 'color', 'colors', 'image', 'picture']
            },
            {
                name: 'Colors',
                execArg: `ms-settings:personalization-colors`,
                tags: ['custom', 'customization']
            },
            {
                name: 'Start',
                execArg: `ms-settings:personalization-start`,
                tags: ['custom', 'customization', 'search']
            },
            {
                name: 'Power & sleep',
                execArg: `ms-settings:powersleep`,
                tags: ['energy', 'plan']
            },
            {
                name: 'Proximity',
                execArg: `ms-settings:proximity`,
                tags: []
            },
            {
                name: 'Display',
                execArg: `ms-settings:screenrotation`,
                tags: ['screen', 'resolution', '4k', 'hd', 'rotation']
            },
            {
                name: 'Sign-in options',
                execArg: `ms-settings:signinoptions`,
                tags: ['password', 'change', 'security', 'secret', 'account']
            },
            {
                name: 'Storage Sense',
                execArg: `ms-settings:storagesense`,
                tags: ['hard', 'disk', 'ssd', 'hdd']
            },
            {
                name: 'Themes',
                execArg: `ms-settings:themes`,
                tags: ['custom', 'customization', 'color', 'colors', 'image', 'picture']
            },
            {
                name: 'Typing',
                execArg: `ms-settings:typing`,
                tags: ['input', 'keyboard']
            },
            {
                name: 'Tablet mode',
                execArg: `ms-settings://tabletmode/`,
                tags: ['mobile', 'touch']
            },
            {
                name: 'Privacy',
                execArg: `ms-settings:privacy`,
                tags: []
            }
        ]
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
                    isActive: false
                })
        }

        return result
    }

    getIcon() {
        return this.icon
    }

    tagsMatchesUserInput(tags, userInput) {
        if (tags.length === 0) {
            return false
        }
        else {
            for (let tag of tags) {
                if (stringHelpers.stringContainsSubstring(tag, userInput))
                    return true
            }

            return false
        }
    }

    windowsAppMatchesUserInput(windowsApp, userInput) {
        return stringHelpers.stringContainsSubstring(windowsApp.name, userInput)
            || stringHelpers.stringContainsSubstring(windowsApp.execArg, userInput)
            || this.tagsMatchesUserInput(windowsApp.tags, userInput)
    }
}