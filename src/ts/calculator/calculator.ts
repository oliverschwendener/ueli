import * as mathjs from "mathjs";
import { CalculatorHelper } from "../helpers/calculator-helper";

export class Calculator {
    public static isValidInput(input: string): boolean {
        if (input.length === 0) {
            return false;
        }

        if (CalculatorHelper.getBlackListInputs().find((b) => input === b) !== undefined) {
            return false;
        }

        let result;
        try {
            // Mathjs throws an error when input cannot be evaluated
            result = mathjs.eval(input);
        } catch (e) {
            return false;
        }
        return !isNaN(result) || this.isValidMathType(result) || false;
    }

    public static calculate(input: string, precision: number): string {
        precision = Number(precision);
        if (precision > 64 || precision < 0) {
            precision = 16;
        }
        mathjs.config({ number: "BigNumber", precision });
        return mathjs.eval(input).toString();
    }

    private static isValidMathType(input: any): boolean {
        const mathType = mathjs.typeof(input);

        if ((mathType === "Unit" && input.value === null)
            || (mathType === "Function")) {
            return false;
        }

        return true;
    }
}
