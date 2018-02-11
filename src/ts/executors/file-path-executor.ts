import * as childProcess from "child_process";
import { Executor } from "./executor";

function handleExecution(command: string): void {
    childProcess.exec(command, (err, stoud, sterr) => {
        if (err) {
            throw err;
        }
    });
}

export class WindowsFilePathExecutor implements Executor, FileLocationExecutor {
    public execute(filePath: string): void {
        let command = `start "" "${filePath}"`;
        handleExecution(command);
    }

    public isValidForExecution(filePath: string): boolean {
        // copied from https://www.regextester.com/96741
        let regex = new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
        return regex.test(filePath);
    }

    public openFileLocation(filePath: string): void {
        let command = `start explorer.exe /select,"${filePath}"`;
        handleExecution(command);
    }
}

export class MacOsFilePathExecutor implements Executor, FileLocationExecutor {
    public execute(filePath: string): void {
        let command = `open "${filePath}"`;
        handleExecution(command);
    }

    public isValidForExecution(filePath: string): boolean {
        // copied from https://stackoverflow.com/questions/6416065/c-sharp-regex-for-file-paths-e-g-c-test-test-exe/42036026#42036026
        let regex = new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
        return regex.test(filePath);
    }

    public openFileLocation(filePath: string): void {
        let command = `open -R "${filePath}"`;
        handleExecution(command);
    }
}

export interface FileLocationExecutor {
    openFileLocation(filePath: string): void;
}