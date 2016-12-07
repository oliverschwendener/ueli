import os from 'os';

export default class DefaultConfig {
    GetConfig() {
        return {
            theme: 'win10',
            maxResultItems: 10,
            folders: [
                os.homedir() + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu',
                'C:\\ProgramData\\Microsoft\\Windows\\Start Menu'
            ]
        }
    }
}