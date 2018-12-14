import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { Injector } from "../injector";

export class WindowsAdminFilePathExecutionArgumentValidator implements ExecutionArgumentValidator {
    private readonly allowedFileExtensions = [
        ".lnk",
        ".exe",
    ];

    public isValidForExecution(executionArgument: string): boolean {
        return Injector.getFilePathRegExp("win32").test(executionArgument)
            && this.filePathMatchesAllowedFileExtensions(executionArgument);
    }

    private filePathMatchesAllowedFileExtensions(filePath: string): boolean {
        for (const allowedFileExtension of this.allowedFileExtensions) {
            if (filePath.endsWith(allowedFileExtension)) {
                return true;
            }
        }

        return false;
    }
}
