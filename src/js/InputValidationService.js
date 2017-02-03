import InstalledPrograms from './InstalledPrograms'
import FilePathExecutor from './Executors/FilePathExecutor';
import WebUrlExecutor from './Executors/WebUrlExecutor';
import CommandLineExecutor from './Executors/CommandLineExecutor';
import EzrCommandExecutor from './Executors/EzrCommandExecutor';
import WebSearchExecutor from './Executors/WebSearchExecutor';

const defaultSearchIcon = 'fa fa-search';

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
        let result;

        try {
            for (let validator of this.validators)
                if (validator.isValid(userInput))
                    result = validator.getIcon(userInput);
        }
        catch(exception) {
            console.log(exception);
            return defaultSearchIcon;
        }

        return (result === undefined || result === null || result === '')
            ? defaultSearchIcon
            : result;
    }

    getDefaultSearchIcon() {
        return defaultSearchIcon;
    }
}