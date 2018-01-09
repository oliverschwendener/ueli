import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import StringHelpers from '../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()

export default class Windows10Settings {
    constructor() {
        this.icon = 'fa fa-windows'
        this.prefix = 'ms-settings'
        this.windowsApps = [
            {
                name: 'Battery Saver',
                execArg: `ms-settings:batterysaver`
            },
            {
                name: 'Battery use',
                execArg: `ms-settings:batterysaver-usagedetails`
            },
            {
                name: 'Battery Saver Settings',
                execArg: `ms-settings:batterysaver-settings`
            },
            {
                name: 'Bluetooth',
                execArg: `ms-settings:bluetooth`
            },
            {
                name: 'Colors',
                execArg: `ms-settings:colors`
            },
            {
                name: 'Data Usage',
                execArg: `ms-settings:datausage`
            },
            {
                name: 'Date and Time',
                execArg: `ms-settings:dateandtime`
            },
            {
                name: 'Closed Captioning',
                execArg: `ms-settings:easeofaccess-closedcaptioning`
            },
            {
                name: 'High Contrast',
                execArg: `ms-settings:easeofaccess-highcontrast`
            },
            {
                name: 'Magnifier',
                execArg: `ms-settings:easeofaccess-magnifier`
            },
            {
                name: 'Narrator',
                execArg: `ms-settings:easeofaccess-narrator`
            },
            {
                name: 'Keyboard',
                execArg: `ms-settings:easeofaccess-keyboard`
            },
            {
                name: 'Mouse',
                execArg: `ms-settings:easeofaccess-mouse`
            },
            {
                name: 'Other Options (Ease of Access)',
                execArg: `ms-settings:easeofaccess-otheroptions`
            },
            {
                name: 'Lockscreen',
                execArg: `ms-settings:lockscreen`
            },
            {
                name: 'Offline maps',
                execArg: `ms-settings:maps`
            },
            {
                name: 'Airplane mode',
                execArg: `ms-settings:network-airplanemode`
            },
            {
                name: 'Proxy',
                execArg: `ms-settings:network-proxy`
            },
            {
                name: 'VPN',
                execArg: `ms-settings:network-vpn`
            },
            {
                name: 'Notifications & actions',
                execArg: `ms-settings:notifications`
            },
            {
                name: 'Account info',
                execArg: `ms-settings:privacy-accountinfo`
            },
            {
                name: 'Calendar',
                execArg: `ms-settings:privacy-calendar`
            },
            {
                name: 'Contacts',
                execArg: `ms-settings:privacy-contacts`
            },
            {
                name: 'Other Devices',
                execArg: `ms-settings:privacy-customdevices`
            },
            {
                name: 'Feedback',
                execArg: `ms-settings:privacy-feedback`
            },
            {
                name: 'Location',
                execArg: `ms-settings:privacy-location`
            },
            {
                name: 'Messaging',
                execArg: `ms-settings:privacy-messaging`
            },
            {
                name: 'Microphone',
                execArg: `ms-settings:privacy-microphone`
            },
            {
                name: 'Motion',
                execArg: `ms-settings:privacy-motion`
            },
            {
                name: 'Radios',
                execArg: `ms-settings:privacy-radios`
            },
            {
                name: 'Speech, inking, & typing',
                execArg: `ms-settings:privacy-speechtyping`
            },
            {
                name: 'Camera',
                execArg: `ms-settings:privacy-webcam`
            },
            {
                name: 'Region & language',
                execArg: `ms-settings:regionlanguage`
            },
            {
                name: 'Speech',
                execArg: `ms-settings:speech`
            },
            {
                name: 'Windows Update',
                execArg: `ms-settings:windowsupdate`
            },
            {
                name: 'Work access',
                execArg: `ms-settings:workplace`
            },
            {
                name: 'Connected devices',
                execArg: `ms-settings:connecteddevices`
            },
            {
                name: 'For developers',
                execArg: `ms-settings:developers`
            },
            {
                name: 'Display',
                execArg: `ms-settings:display`
            },
            {
                name: 'Mouse & touchpad',
                execArg: `ms-settings:mousetouchpad`
            },
            {
                name: 'Cellular',
                execArg: `ms-settings:network-cellular`
            },
            {
                name: 'Dial-up',
                execArg: `ms-settings:network-dialup`
            },
            {
                name: 'DirectAccess',
                execArg: `ms-settings:network-directaccess`
            },
            {
                name: 'Ethernet',
                execArg: `ms-settings:network-ethernet`
            },
            {
                name: 'Mobile hotspot',
                execArg: `ms-settings:network-mobilehotspot`
            },
            {
                name: 'Wi-Fi',
                execArg: `ms-settings:network-wifi`
            },
            {
                name: 'Manage Wi-Fi Settings',
                execArg: `ms-settings:network-wifisettings`
            },
            {
                name: 'Optional features',
                execArg: `ms-settings:optionalfeatures`
            },
            {
                name: 'Family & other users',
                execArg: `ms-settings:otherusers`
            },
            {
                name: 'Personalization',
                execArg: `ms-settings:personalization`
            },
            {
                name: 'Backgrounds',
                execArg: `ms-settings:personalization-background`
            },
            {
                name: 'Colors',
                execArg: `ms-settings:personalization-colors`
            },
            {
                name: 'Start',
                execArg: `ms-settings:personalization-start`
            },
            {
                name: 'Power & sleep',
                execArg: `ms-settings:powersleep`
            },
            {
                name: 'Proximity',
                execArg: `ms-settings:proximity`
            },
            {
                name: 'Display',
                execArg: `ms-settings:screenrotation`
            },
            {
                name: 'Sign-in options',
                execArg: `ms-settings:signinoptions`
            },
            {
                name: 'Storage Sense',
                execArg: `ms-settings:storagesense`
            },
            {
                name: 'Themes',
                execArg: `ms-settings:themes`
            },
            {
                name: 'Typing',
                execArg: `ms-settings:typing`
            },
            {
                name: 'Tablet mode',
                execArg: `ms-settings://tabletmode/`
            },
            {
                name: 'Privacy',
                execArg: `ms-settings:privacy`
            }
        ]
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

    windowsAppMatchesUserInput(windowsApp, userInput) {
        return stringHelpers.stringContainsSubstring(windowsApp.name, userInput)
            || stringHelpers.stringContainsSubstring(windowsApp.execArg, userInput)
    }
}