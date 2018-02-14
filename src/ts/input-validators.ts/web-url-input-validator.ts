import { InputValidator } from "./input-validator";
import { Injector } from "../injector";

export class WebUrlInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        let regex = Injector.getWebUrlRegExp();
        return regex.test(userInput);
    }
}