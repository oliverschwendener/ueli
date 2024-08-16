import { IniFileParser as IniFileParserInterface } from "./Contract";

export class IniFileParser implements IniFileParserInterface {
    // Defaults to ';' as comment
    public parseIniFileContent(
        fileString: string,
        commentDelimiter: string = ";",
        allowInlineComments?: boolean,
    ): Record<string, Record<string, string>> {
        let fileLines = fileString.split(/(\r\n|\r|\n)/);

        fileLines = fileLines.filter((line) => !line.startsWith(commentDelimiter) && line.trim() !== "");

        if (allowInlineComments) {
            fileLines = fileLines.map((line) => {
                const index = line.indexOf(commentDelimiter);
                return index >= 0 ? line.slice(0, index) : line;
            });
        }

        const result: Record<string, Record<string, string>> = {};

        let group = "";
        result[group] = {};

        for (const line of fileLines) {
            // New group
            if (line.startsWith("[") && line.endsWith("]") && !line.slice(1, -1).match(/\[\]/m)) {
                if (result[line]) {
                    throw `Ini Format Error! Duplicate groups found in ${fileString}`;
                }

                group = line.slice(1, -1);
                result[group] = {};
            } else {
                // Entry
                const [key, ...entrySplit] = line.split("=").map((text) => text.trim());
                const entry = entrySplit.join("=");

                if (result[group][key]) {
                    throw `Ini Format Error! Duplicate key in ${group} in file ${fileString}`;
                }

                result[group][key] = entry;
            }
        }

        return result;
    }
}
