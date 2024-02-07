import { all, create, evaluate, typeOf } from "mathjs";

export class Calculator {
    public static isValidExpression({
        expression,
        decimalSeparator,
        argumentSeparator,
    }: {
        expression: string;
        decimalSeparator: string;
        argumentSeparator: string;
    }): boolean {
        const blackListInputs = ["version", "i"];

        if (expression.length === 0) {
            return false;
        }

        if (blackListInputs.find((b) => expression === b) !== undefined) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any;

        try {
            // Mathjs throws an error when input cannot be evaluated
            result = evaluate(this.normalizeExpression({ expression, decimalSeparator, argumentSeparator }));
        } catch (e) {
            return false;
        }

        if (result === undefined) {
            return false;
        }

        if (`${result}` === expression) {
            return false;
        }

        return !isNaN(result) || this.isValidMathType(result) || false;
    }

    private static normalizeExpression({
        expression,
        decimalSeparator,
        argumentSeparator,
    }: {
        expression: string;
        decimalSeparator: string;
        argumentSeparator: string;
    }) {
        return expression.replace(new RegExp(`\\${decimalSeparator}|\\${argumentSeparator}`, "g"), (match) =>
            match === decimalSeparator ? "." : ",",
        );
    }

    public static calculate({
        expression,
        precision,
        decimalSeparator,
        argumentSeparator,
    }: {
        expression: string;
        precision: number;
        decimalSeparator: string;
        argumentSeparator: string;
    }): string {
        precision = Number(precision);

        if (precision > 64 || precision < 0) {
            precision = 16;
        }

        const math = create(all, { precision, number: "BigNumber" });

        const result = String(
            math.evaluate(this.normalizeExpression({ expression, decimalSeparator, argumentSeparator })),
        );

        return result.replace(new RegExp(",|\\.", "g"), (match) =>
            match === "." ? decimalSeparator : argumentSeparator,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static isValidMathType(value: any): boolean {
        const mathType = typeOf(value);

        if ((mathType === "Unit" && value.value === null) || mathType === "function") {
            return false;
        }

        return true;
    }
}
