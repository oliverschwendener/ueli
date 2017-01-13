import { exec } from 'child_process';
import InstalledPrograms from './InstalledPrograms';
import UserHistory from './UserHistory';

export default class ProgramExecutor {
    constructor() {
        this.programs = new InstalledPrograms().getAll();
        this.history = new UserHistory();
    }

    isValid(path) {
        for (let program of this.programs)
            if (program.path === path)
                return true;

        return false;
    }

    execute(path) {
        exec(`start "" "${path}"`, (error, stdout, sterr) => {
            if (error)
                throw error;
        });

        this.history.addItem(path);
    }
}