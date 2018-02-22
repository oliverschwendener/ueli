import { Injector } from "../injector";
import { InputValidator } from "./input-validator";

export class FilePathInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        const regex = Injector.getFilePathRegExp();
        return regex.test(userInput);
    }
}
