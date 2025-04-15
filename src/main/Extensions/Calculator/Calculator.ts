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

        const math = create(all, { precision: 64, number: "BigNumber" });
        const calculationResult = String(
            math.evaluate(this.normalizeExpression({ expression, decimalSeparator, argumentSeparator })),
        );

        let result = calculationResult;

        try {
            // Try to extract the number / unit using a regular expression
            // Group 1: Number including separator
            // Group 2: Spaces if available
            // Group 3: Unit if available
            const resultRegex = /([\d,.]*)(\s*)(.*)/g;
            let matches;

            while ((matches = resultRegex.exec(result)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (matches.index === resultRegex.lastIndex) {
                    resultRegex.lastIndex++;
                }

                // Round the number with precision and put the result together again
                result = String(math.round(math.bignumber(matches[1]), precision)) + matches[2] + matches[3];
            }
        } catch (error) {
            // If any error occurs, resetting to the calculation result is better than throwing an exception
            result = calculationResult;
        }

        result = result.replace(/[,.]/g, (match) => (match === "." ? decimalSeparator : argumentSeparator));
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static isValidMathType(value: any): boolean {
        const mathType = typeOf(value);

        return !((mathType === "Unit" && value.value === null) || mathType === "function");
    }
}
