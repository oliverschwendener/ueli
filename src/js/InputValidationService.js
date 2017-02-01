import InstalledPrograms from './InstalledPrograms'
import FilePathExecutor from './Executors/FilePathExecutor';
import WebUrlExecutor from './Executors/WebUrlExecutor';
import CommandLineExecutor from './Executors/CommandLineExecutor';
import EzrCommandExecutor from './Executors/EzrCommandExecutor';
import WebSearchExecutor from './Executors/WebSearchExecutor';

export default class InputValidationService {
    constructor() {
        this.validators = [
            new InstalledPrograms(),
            new CommandLineExecutor(),
            new FilePathExecutor(),
            new WebSearchExecutor(),
            new WebUrlExecutor,
            new EzrCommandExecutor()
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