import {exec} from 'child_process';

export default class ShellCommandExecutor {
    isValid(input) {
        if (input.startsWith('>'))
            return true;

        return false;
    }

    execute(command) {
        command = command.replace('>', '').toLowerCase();
        command = `start cmd /K ${command}`;

        exec(command, (error, stdout, stderr) => {
            if(error)
                throw error;
        });
    }
}