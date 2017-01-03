import { exec } from 'child_process';

export default class ConsoleApplicationExecutor {
    constructor() {
        this.cmdPath = 'C:\\Windows\\System32\\cmd.exe';
    }

    isValid(input) {
        if (input.startsWith('>'))
            return true;

        return false;
    }

    execute(command) {
        command = command.replace('>', '').toLowerCase();
        command = `start cmd /K ${command}`;

        exec(command, (error, stdout, stderr) => {
            if (error)
                throw error;
        });
    }

    getInfoMessage(command) {
        command = command.replace('>', '');
        return `<div>
                    <p class="app-name">Execute ${command}</p>
                    <p class="app-path">${this.cmdPath} /K ${command}</p>
                </div>`;
    }
}