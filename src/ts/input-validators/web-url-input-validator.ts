import { Injector } from "../injector";
import { InputValidator } from "./input-validator";
import { EmailAddressInputValidator } from "./email-address-input-validator";

export class WebUrlInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        const regex = Injector.getWebUrlRegExp();
        return regex.test(userInput)
            && !new EmailAddressInputValidator().isValidForSearchResults(userInput);
    }
}
