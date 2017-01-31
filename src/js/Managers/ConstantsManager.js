export default class Constans {
    constructor() {
        this.configFilePath = `${process.env.USERPROFILE}\\ezr_config.json`;
    }

    getConfigFilePath() {
        return this.configFilePath;
    }
}