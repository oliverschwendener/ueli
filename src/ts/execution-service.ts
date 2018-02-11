import * as childProcess from "child_process";
import { Injector } from "./injector";
import { ElectronizrCommandValidator } from "./plugins/electronizr-commands-plugin";
import { ipcMain } from "electron";

export class ExecutionService {
    private filePathValidator: FilePathValidator;
    private filePathExecutor: FilePathExecutor;
    private electronizrCommandValidator: ElectronizrCommandValidator;

    constructor() {
        this.filePathValidator = Injector.getFilePathValidator();
        this.filePathExecutor = Injector.getFilePathExecutor();
        this.electronizrCommandValidator = new ElectronizrCommandValidator();
    }

    public execute(executionArgument: string): void {
        if (this.filePathValidator.isFilePath(executionArgument)) {
            this.filePathExecutor.executeFilePath(executionArgument);
        }
        else if (this.electronizrCommandValidator.isElectronizrCommand(executionArgument)) {
            ipcMain.emit(executionArgument);
        }
        else {
            throw new Error(`This argument (${executionArgument}) is not supported`);
        }
    }
}

export class WindowsFilePathExecutor implements FilePathExecutor {
    public executeFilePath(filePath: string): void {
        childProcess.exec(`start "" "${filePath}"`, (err, stout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}

export class MacOsFilePathExecutor implements FilePathExecutor {
    public executeFilePath(filePath: string): void {
        childProcess.exec(`open "${filePath}"`, (err, stdout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}

export interface FilePathExecutor {
    executeFilePath(filePath: string): void;
}

export class WindowsFilePathValidator implements FilePathValidator {
    public isFilePath(filePath: string): boolean {
        // copy paste from https://www.regextester.com/96741
        let regex = new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
        return regex.test(filePath);
    }
}

export class MacOsFilePathValidator implements FilePathValidator {
    public isFilePath(filePath: string): boolean {
        // copy paste from https://stackoverflow.com/questions/6416065/c-sharp-regex-for-file-paths-e-g-c-test-test-exe/42036026#42036026
        let regex = new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
        return regex.test(filePath);
    }
}

export interface FilePathValidator {
    isFilePath(filePath: string): boolean;
}