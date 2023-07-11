import { all, create, evaluate, typeOf } from "mathjs";

export class Calculator {
    public static isValidInput(input: string, decimalSeparator = ".", argumentSeparator = ","): boolean {
        const blackListInputs = ["version", "i"];

        if (input.length === 0) {
            return false;
        }

        if (blackListInputs.find((b) => input === b) !== undefined) {
            return false;
        }

        let result;
        try {
            // Mathjs throws an error when input cannot be evaluated
            result = evaluate(this.normalizeInput(input, decimalSeparator, argumentSeparator));
        } catch (e) {
            return false;
        }

        if (result === undefined) {
            return false;
        }

        return !isNaN(result) || this.isValidMathType(result) || false;
    }

    private static normalizeInput(input: string, decimalSeparator: string, argumentSeparator: string) {
        return input.replace(new RegExp(`\\${decimalSeparator}|\\${argumentSeparator}`, "g"), (match) =>
            match === decimalSeparator ? "." : ",",
        );
    }

    public static calculate(input: string, precision: number, decimalSeparator = ".", argumentSeparator = ","): string {
        precision = Number(precision);

        if (precision > 64 || precision < 0) {
            precision = 16;
        }

        const math = this.math(precision);

        if (!math.evaluate) {
            throw new Error("Failed to instantiate math js static");
        }

        const result = String(math.evaluate(this.normalizeInput(input, decimalSeparator, argumentSeparator)));

        return result.replace(new RegExp(",|\\.", "g"), (match) =>
            match === "." ? decimalSeparator : argumentSeparator,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static isValidMathType(input: any): boolean {
        const mathType = typeOf(input);

        if ((mathType === "Unit" && input.value === null) || mathType === "Function") {
            return false;
        }

        return true;
    }

    private static math(precision: number): Partial<math.MathJsStatic> {
        return create(all, { precision, number: "BigNumber" });
    }
}
