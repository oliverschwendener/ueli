import path from 'path';
import ElectronizrCommands from './ElectronizrCommands';

export default class InputValidationService {
    constructor() {
        this.electronizrCommands = new ElectronizrCommands().GetAll();
    }

    IsValidHttpOrHttpsUrl(url) {
        if (url.endsWith('.exe')) return false;

        let expression = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/gi;
        let regex = new RegExp(expression);

        if (url.match(regex))
            return true;

        return false;
    }

    IsValidWebSearch(query, allWebSearches) {
        if(query.indexOf(':') < 0)
            return false;

        let prefix = query.split(':')[0];

        for(let search of allWebSearches) {
            if(prefix === search.prefix)
                return true;
        }

        return false;
    }

    IsElectronizrCommand(command) {
        for(let ezrCommand of this.electronizrCommands)
            if(ezrCommand.command === command)
                return true;

        return false;
    }

    IsValidWindowsPath(path) {
        let expression = /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
        let regex = new RegExp(expression);

        return path.match(regex);
    }

    IsShellCommand(input) {
        if(input.startsWith('>'))
            return true;

        return false;
    }

    GetFontAwesomeIconClass(input, allWebSearches) {
        let defaultIcon = 'fa-globe';
        let prefix = input.split(':')[0];

        for(let search of allWebSearches) {
            if(prefix === search.prefix) {
                if(search.fontAwesomeIconClass === undefined)
                    return defaultIcon;
                else
                    return search.fontAwesomeIconClass;
            }
        }

        return defaultIcon;
    }
}