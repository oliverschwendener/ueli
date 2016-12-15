import { exec } from 'child_process';
import InstalledPrograms from './InstalledPrograms.js';

export default class ProgramExecutor {
    constructor() {
        this.programs = new InstalledPrograms().getAll();
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
    }
}