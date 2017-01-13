import InstalledPrograms from './InstalledPrograms'
import FilePathExecutor from './FilePathExecutor';
import WebUrlExecutor from './WebUrlExecutor';
import CommandLineExecutor from './CommandLineExecutor';
import EzrCommandExecutor from './EzrCommandExecutor';
import WebSearchExecutor from './WebSearchExecutor';

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