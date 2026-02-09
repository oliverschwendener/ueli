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
            if (this.input[this.position] === '$') {
                nodes.push(this.parseDollarExpression());
            } else {
                nodes.push(this.parseLiteral());
            }
        }

        return nodes;
    }

    private parseLiteral(): TokenType {
        let value = "";
        
        while (this.position < this.input.length && !this.isDollarExpression(this.input[this.position])) {
            value += this.input[this.position++];
        }

        return { type: 'literal', value };
    }

    private isDollarExpression(char: string): boolean {
        return char === '$';
    }

    private parseDollarExpression(): TokenType {
        this.position++;

        if (/\d/.test(this.input[this.position])) {
            let numStr = "";

            while (this.position < this.input.length && /\d/.test(this.input[this.position])) {
                numStr += this.input[this.position++];
            }

            return { type: 'column', index: parseInt(numStr) };
        }

        let name = "";

        while (this.position < this.input.length && /[a-zA-Z]/.test(this.input[this.position])) {
            name += this.input[this.position++];
        }

        if (this.input[this.position] === '(') {
            this.position++;
            const params: TokenType[][] = [];
            
            while (this.position < this.input.length && this.input[this.position] !== ')') {
                params.push(this.parseParameterContent());
                
                if (this.input[this.position] === ',') {
                    this.position++;
                }
            }

        if (this.position < this.input.length && this.input[this.position] === ')') {
            this.position++;
        }

            return { type: 'function', name, params };
        }

        return { type: 'literal', value: '$' + name };
    }

    private parseParameterContent(): TokenType[] {
        const nodes: TokenType[] = [];

        while (this.position < this.input.length && this.input[this.position] !== ',' && this.input[this.position] !== ')') {
            if (this.input[this.position] === '$') {
                nodes.push(this.parseDollarExpression());
            } else {
                nodes.push(this.parseLiteralParameter());
            }
        }

        return nodes;
    }

    private parseLiteralParameter(): TokenType {        
        let value = "";
    
        while (this.position < this.input.length && 
            this.input[this.position] !== '$' && 
            this.input[this.position] !== ',' && 
            this.input[this.position] !== ')') {
            value += this.input[this.position++];
        }

        return { type: 'literal', value };
    }
}