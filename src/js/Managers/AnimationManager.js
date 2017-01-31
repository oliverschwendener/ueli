import ConfigManager from './ConfigManager';

export default class AnimationManager {
    getScrollAnimationSpeed() {
        let configAnimationSpeed = new ConfigManager().getConfig().scrollAnimationSpeed;
        return configAnimationSpeed === undefined
            ? 'fast'
            : configAnimationSpeed;
    }
}