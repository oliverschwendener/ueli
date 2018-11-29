import * as math from "mathjs";
import { InputValidator } from "./input-validator";
import { CalculatorHelper } from "../helpers/calculator-helper";

export class CalculatorInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        if (CalculatorHelper.getBlackListInputs().find((b) => userInput === b) !== undefined) {
            return false;
        }

        let result;
        try {
            // Mathjs throws an error when input cannot be evaluated
            result = math.eval(userInput);
        } catch (e) {
            return false;
        }
        return !isNaN(result) || this.isValidMathType(result) || false;
    }

    private isValidMathType(input: any): boolean {
        const mathType = math.typeof(input);

        if ((mathType === "Unit" && input.value === null)
            || (mathType === "Function")) {
            return false;
        }

        return true;
    }
}
