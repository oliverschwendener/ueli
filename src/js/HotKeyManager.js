import ConfigHelper from './ConfigHelper';

export default class HotKeyManager {
    getHotKey() {
        let configHotKey = new ConfigHelper().getConfig().hotKey;

        return configHotKey === undefined
            ? 'alt+space'
            : configHotKey;
    }
}