import type { TextProcessor } from "./TextProcessor";
import { TokenEvaluator } from "./Tokenizer/TokenEvaluator";
import { TokenParser } from "./Tokenizer/TokenParser";

export class RowlandTextProcessor implements TextProcessor {
    private tokenEvaluator: TokenEvaluator;

    public constructor() {
        this.tokenEvaluator = new TokenEvaluator();
    }

    public process(input: string, pattern: string, rowSeparator: string, columnSeparator: string): string {
        try {
            const unescapedRowSep = this.unescape(rowSeparator);
            const unescapedColSep = this.unescape(columnSeparator);

            const rows = this.split(input, unescapedRowSep);
            const tokens = new TokenParser(pattern).parse();

            const processedRows = rows.map((row) => {
                const columns = this.split(row, unescapedColSep);
                return this.tokenEvaluator.evaluate(tokens, columns);
            });
            return processedRows.join(unescapedRowSep);
        } catch (error) {
            return String(error);
        }
    }

    public split(input: string, separator: string): string[] {
        if (separator === "") {
            return [input];
        }

        return input.split(separator);
    }

    public unescape(str: string): string {
        return str.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r").replace(/\\\\/g, "\\");
    }
}
