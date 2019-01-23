import { InputValidator } from "./input-validator";
import { Calculator } from "../calculator/calculator";

export class CalculatorInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        return Calculator.isValidInput(userInput);
    }
}
