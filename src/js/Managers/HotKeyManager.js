import ConfigManager from './ConfigManager';

export default class HotKeyManager {
    getHotKey() {
        let configHotKey = new ConfigManager().getConfig().hotKey;

        return configHotKey === undefined
            ? 'alt+space'
            : configHotKey;
    }
}