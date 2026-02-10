import type { TokenType } from "./TokenType";

export class TokenParser {
    private position = 0;
    private input: string;

    public constructor(input: string) {
        this.input = input;
    }

    public parse(): TokenType[] {
        const nodes: TokenType[] = [];

        while (this.position < this.input.length) {
            const literal = this.parseLiteral();

            if (literal.type === "literal" && literal.value.length > 0) {
                nodes.push(literal);
            }

            if (this.position < this.input.length && this.input[this.position] === "$") {
                nodes.push(this.parseDollarExpression());
            }
        }

        return nodes;
    }

    private parseLiteral(): TokenType {
        let value = "";

        while (this.position < this.input.length && this.input[this.position] !== "$") {
            value += this.input[this.position++];
        }

        while (this.position < this.input.length && this.input[this.position] === "$") {
            if (this.position + 1 < this.input.length && this.input[this.position + 1] === "$") {
                value += "$";
                this.position += 2;
            } else {
                break;
            }
        }

        return { type: "literal", value };
    }

    private parseDollarExpression(): TokenType {
        this.position++;

        if (/\d/.test(this.input[this.position])) {
            let numStr = "";

            while (this.position < this.input.length && /\d/.test(this.input[this.position])) {
                numStr += this.input[this.position++];
            }

            return { type: "column", index: parseInt(numStr) };
        }

        let name = "";

        while (this.position < this.input.length && /[a-zA-Z]/.test(this.input[this.position])) {
            name += this.input[this.position++];
        }

        if (name.length === 0 && this.input[this.position] === "(") {
            this.parseError("Invalid function syntax: expected function name before '('");
        }

        if (this.input[this.position] === "(") {
            this.position++;
            const params: TokenType[][] = [];

            while (this.position < this.input.length && this.input[this.position] !== ")") {
                params.push(this.parseParameterContent());

                if (this.input[this.position] === ",") {
                    this.position++;
                }
            }

            if (this.position >= this.input.length) {
                this.parseError(`Unclosed function bracket. Expected ')' for function '${name}'`);
            }

            this.position++;
            return { type: "function", name, params };
        }

        return { type: "literal", value: "$" + name };
    }

    private parseParameterContent(): TokenType[] {
        const nodes: TokenType[] = [];

        while (
            this.position < this.input.length &&
            this.input[this.position] !== "," &&
            this.input[this.position] !== ")"
        ) {
            if (this.input[this.position] === "$") {
                nodes.push(this.parseDollarExpression());
            } else {
                nodes.push(this.parseLiteralParameter());
            }
        }

        if (this.position < this.input.length && this.input[this.position] === ",") {
            if (this.position + 1 < this.input.length && this.input[this.position + 1] === ")") {
                this.parseError("Empty parameter: trailing comma before ')'");
            }
        }

        return nodes;
    }

    private parseLiteralParameter(): TokenType {
        let value = "";

        while (
            this.position < this.input.length &&
            this.input[this.position] !== "$" &&
            this.input[this.position] !== "," &&
            this.input[this.position] !== ")"
        ) {
            if (this.input[this.position] === "(") {
                this.parseError("Unmatched '(': opening bracket without corresponding function");
            }

            value += this.input[this.position++];
        }

        return { type: "literal", value };
    }

    private parseError(message: string): void {
        throw new Error(`Pattern parse error at position ${this.position}: ${message}`);
    }
}
