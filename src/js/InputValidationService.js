import InstalledPrograms from './InstalledPrograms.js'
import FilePathExecutor from './FilePathExecutor.js';
import WebUrlExecutor from './WebUrlExecutor.js';
import CommandLineExecutor from './CommandLineExecutor.js';
import EzrCommandExecutor from './EzrCommandExecutor.js';
import WebSearchExecutor from './WebSearchExecutor.js';

export default class InputValidationService {
    constructor() {
        this.validators = [
            new InstalledPrograms(),
            new FilePathExecutor(),
            new WebUrlExecutor,
            new CommandLineExecutor(),
            new EzrCommandExecutor(),
            new WebSearchExecutor()
        ];
    }

    getInfoMessage(userInput) {
        for (let validator of this.validators)
            if (validator.isValid(userInput))
                return validator.getInfoMessage(userInput);
    }

    getIcon(userInput) {
        let defaultIcon = 'fa fa-search';
        let result;

        try {
            for (let validator of this.validators)
                if (validator.isValid(userInput))
                    result = validator.getIcon(userInput);
        }
        catch(exception) {
            console.log(exception);
            return defaultIcon;
        }

        return (result === undefined || result === null || result === '')
            ? defaultIcon
            : result;
    }
}