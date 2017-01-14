import ConfigHelper from './ConfigHelper';

export default class AnimationManager {
    getScrollAnimationSpeed() {
        let configAnimationSpeed = new ConfigHelper().getConfig().scrollAnimationSpeed;
        return configAnimationSpeed === undefined
            ? 'fast'
            : configAnimationSpeed;
    }
}