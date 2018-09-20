import { AutoCompletionValidator } from "./autocompletion-validator";
import { Injector } from "../injector";
import { platform } from "os";
import { lstatSync, existsSync } from "fs";

export class FilePathAutoCompletionValidator implements AutoCompletionValidator {
    public isValidForAutoCompletion(executionArgument: string): boolean {
        const regex = Injector.getFilePathRegExp(platform());
        return regex.test(executionArgument);
    }

    public getAutoCompletionResult(executionArgument: string): string {
        const dirSeparator = Injector.getDirectorySeparator(platform());

        if (existsSync(executionArgument)) {
            if (!executionArgument.endsWith(dirSeparator) && lstatSync(executionArgument).isDirectory()) {
                return `${executionArgument}${dirSeparator}`;
            }
        }

        return executionArgument;
    }
}
