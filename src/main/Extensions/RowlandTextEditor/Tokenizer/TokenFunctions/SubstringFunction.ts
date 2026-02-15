import type { TokenFunction } from "./TokenFunction";

export class SubstringFunction implements TokenFunction {
    public name = "SUBSTRING";

    public evaluate(params: string[]): string {
        if (params.length < 3) {
            throw new Error("SUBSTRING function requires at least 3 parameters: string, start, length");
        }

        if (isNaN(Number(params[1])) || isNaN(Number(params[2]))) {
            throw new Error("Start and length parameters must be valid numbers");
        }

        const str = params[0];

        return str.substring(Number(params[1]), Number(params[2]));
    }
}
