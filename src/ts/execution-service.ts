import * as childProcess from "child_process";

export class WindowsExecutionService implements ExecutionService {
    public execute(executionArgument: string): void {
        childProcess.exec(`start "" "${executionArgument}"`, (err, stout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}

export class MacOsExecutionService implements ExecutionService {
    public execute(executionArgument: string): void {
        childProcess.exec(`open ${executionArgument}`, (err, stdout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}

export interface ExecutionService {
    execute(executionArgument: string): void;
}