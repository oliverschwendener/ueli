import type { TextProcessor } from "./TextProcessor";

export class RowlyTextProcessor implements TextProcessor {

    public process(input: string, pattern: string, rowSeparator: string, columnSeparator: string): string {
        const unescapedRowSep = this.unescape(rowSeparator);
        const unescapedColSep = this.unescape(columnSeparator);

        const rows = this.split(input, unescapedRowSep);
        /*const compiledPattern = this.tokenizer.compile(pattern);

        const processedRows = rows.map((row) => {
            const columns = this.split(row, unescapedColSep);
            return this.tokenizer.evaluate(compiledPattern, columns);
        });*/

        //return processedRows.join(unescapedRowSep);
        return "";
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
