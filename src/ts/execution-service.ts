import * as childProcess from "child_process";
import { Injector } from "./injector";
import { ipcMain } from "electron";
import { FilePathValidator } from "./validators/file-path-validator";
import { ElectronizrCommandValidator } from "./validators/electronizr-command-validator";

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