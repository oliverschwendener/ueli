import ConfigManager from './ConfigManager';

export default class WelcomeMessageManager {
    getMessage() {
        let configMessage = new ConfigManager().getConfig().welcomeMessage;
        return configMessage === undefined
            ? 'What are you looking for?'
            : configMessage;
    }
}