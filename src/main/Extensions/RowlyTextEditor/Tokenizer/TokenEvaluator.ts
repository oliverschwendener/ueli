import type { TokenType } from "./TokenType";

export class TokenEvaluator {
    public evaluate(tokens: TokenType[], columns: string[]): string {
        let result = "";

        for (const token of tokens) {
            if (token.type === "literal") {
                result += token.value;
            } else if (token.type === "column") {
                result += columns[token.index] !== undefined ? columns[token.index] : "";
            }
        }

        return result;
    }
}