import { GetDateFunction } from "./TokenFunctions/GetDateFunction";
import { SubstringFunction } from "./TokenFunctions/SubstringFunction";
import type { TokenFunction } from "./TokenFunctions/TokenFunction";
import { UuidFunction } from "./TokenFunctions/UuidFunction";
import type { TokenType } from "./TokenType";

export class TokenEvaluator {
    private functions: Map<string, TokenFunction>;

    public constructor() {
        this.functions = new Map();
        this.registerFunction(new GetDateFunction());
        this.registerFunction(new SubstringFunction());
        this.registerFunction(new UuidFunction());
    }

    public evaluate(tokens: TokenType[], columns: string[]): string {
        let result = "";

        for (const token of tokens) {
            if (token.type === "literal") {
                result += token.value;
            } else if (token.type === "column") {
                result += columns[token.index] !== undefined ? columns[token.index] : "";
            } else if (token.type === "function") {
                const func = this.functions.get(token.name.toUpperCase());

                if (!func) {
                    throw new Error(`Unknown function: ${token.name}`);
                }

                const evaluatedParams = token.params.map((param) => this.evaluate(param, columns));
                result += func.evaluate(evaluatedParams, columns);
            }
        }

        return result;
    }

    private registerFunction(func: TokenFunction): void {
        this.functions.set(func.name.toUpperCase(), func);
    }
}
