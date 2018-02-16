import { InputValidator } from "./input-validator";
import { Injector } from "../injector";

export class FilePathInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        let regex = Injector.getFilePathRegExp();
        return regex.test(userInput);
    }
}