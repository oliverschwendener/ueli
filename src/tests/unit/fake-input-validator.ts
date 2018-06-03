import { InputValidator } from "../../ts/input-validators/input-validator";

export class FakeInputValidator implements InputValidator {
    private returnValue: boolean;

    constructor(returnValue: boolean) {
        this.returnValue = returnValue;
    }

    public isValidForSearchResults(userInput: string): boolean {
        return this.returnValue;
    }
}
