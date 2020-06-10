import * as mathjs from "mathjs";

export class Calculator {
    public static isValidInput(input: string): boolean {
        const blackListInputs = ["version", "i"];

        if (input.length === 0) {
            return false;
        }

        if (blackListInputs.find((b) => input === b) !== undefined) {
            return false;
        }

        input = this.removeCommas(input);

        let result;
        try {
            // Mathjs throws an error when input cannot be evaluated
            result = mathjs.eval(input);
        } catch (e) {
            return false;
        }

        if (result === undefined) {
            return false;
        }

        return !isNaN(result)
            || this.isValidMathType(result)
            || false;
    }

    public static calculate(input: string, precision: number): string {
        input = this.removeCommas(input);
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

    private static removeCommas(input: string): string {
        if (input.includes(",")) {
            input = input.replace(/,/g, "");
        }
        return input;
    }
}
