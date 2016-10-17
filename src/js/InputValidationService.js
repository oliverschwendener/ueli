import path from 'path';

export default class InputValidationService {
    
    IsValidHttpOrHttpsUrl(url) {
        if (url.endsWith('.exe')) return false;

        let expression = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/gi;
        let regex = new RegExp(expression);

        if (url.match(regex))
            return true;

        return false;
    }

    IsElectronizrCommand(command) {
        if (command === 'exit'
            || command === 'reload')
            return true;
    }

    IsValidWindowsPath(path) {
        let expression = /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
        let regex = new RegExp(expression);

        return path.match(regex);
    }

    IsWindowsCommand(input) {
        if (!input.startsWith('>'))
            return false;

        input = input.replace('>', '');
        input = input.split(' ')[0];

        if (!input.endsWith('.exe'))
            input = `${input}.exe`.toLowerCase();

        for (let command of windowsCommands) {
            let fileName = path.basename(command.toLowerCase());
            if (input === fileName)
                return true;
        }

        return false;
    }
}