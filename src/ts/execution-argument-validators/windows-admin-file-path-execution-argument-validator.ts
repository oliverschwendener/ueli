import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { Injector } from "../injector";

export class WindowsAdminFilePathExecutionArgumentValidator implements ExecutionArgumentValidator {
    private readonly programFileExtensions: string[];

    constructor(programFileExtensions: string[]) {
        this.programFileExtensions = programFileExtensions;
    }

    public isValidForExecution(executionArgument: string): boolean {
        return Injector.getFilePathRegExp("win32").test(executionArgument)
            && this.filePathMatchesAllowedFileExtensions(executionArgument);
    }

    private filePathMatchesAllowedFileExtensions(filePath: string): boolean {
        for (const allowedFileExtension of this.programFileExtensions) {
            if (filePath.endsWith(allowedFileExtension)) {
                return true;
            }
        }

        return false;
    }
}
