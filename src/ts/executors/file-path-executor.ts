import * as childProcess from "child_process";
import { Executor } from "./executor";

export class WindowsFilePathExecutor implements Executor {
    public execute(filePath: string): void {
        childProcess.exec(`start "" "${filePath}"`, (err, stout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }

    public isValidForExecution(filePath: string): boolean {
        // copied from https://www.regextester.com/96741
        let regex = new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
        return regex.test(filePath);
    }
}

export class MacOsFilePathExecutor implements Executor {
    public execute(filePath: string): void {
        childProcess.exec(`open "${filePath}"`, (err, stdout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }

    public isValidForExecution(filePath: string): boolean {
        // copied from https://stackoverflow.com/questions/6416065/c-sharp-regex-for-file-paths-e-g-c-test-test-exe/42036026#42036026
        let regex = new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
        return regex.test(filePath);
    }
}