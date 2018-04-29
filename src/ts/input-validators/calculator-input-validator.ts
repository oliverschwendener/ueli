import { Config } from "../config";
import { InputValidator } from "./input-validator";
import * as math from "mathjs";

export class CalculatorInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        try {
            // Mathjs throws an error when input cannot be evaluate
            math.eval(userInput);
        } catch (e) {
            return false
        }
        return true
    }
}
