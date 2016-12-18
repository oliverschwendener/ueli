import InstalledPrograms from './InstalledPrograms.js'
import FilePathExecutor from './FilePathExecutor.js';
import WebUrlExecutor from './WebUrlExecutor.js';
import ShellCommandExecutor from './ShellCommandExecutor.js';
import EzrCommandExecutor from './EzrCommandExecutor.js';
import WebSearchExecutor from './WebSearchExecutor.js';

export default class InputValidationService {
    constructor() {
        this.validators = [
            new InstalledPrograms(),
            new FilePathExecutor(),
            new WebUrlExecutor,
            new ShellCommandExecutor(),
            new EzrCommandExecutor(),
            new WebSearchExecutor()
        ];
    }

    getInfoMessage(userInput) {
        for (let validator of this.validators)
            if (validator.isValid(userInput))
                return validator.getInfoMessage(userInput);
    }
}