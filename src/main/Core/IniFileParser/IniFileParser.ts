import { IniFileParser as IniFileParserInterface } from "./Contract";

export class IniFileParser implements IniFileParserInterface {
    // Defaults to ';' as comment
    public parseIniFileContent(
        fileString: string,
        commentDelimiter: string = ";",
        allowInlineComments?: boolean,
    ): Record<string, Record<string, string>> {
        let fileLines = fileString.split("\n");

        fileLines = fileLines.filter((line) => !line.startsWith(commentDelimiter) && line.trim() !== "");
        if (allowInlineComments) {
            fileLines = fileLines.map((line) => {
                const index = line.indexOf(commentDelimiter);
                return index >= 0 ? line.slice(0, line.indexOf(commentDelimiter)) : line;
            });
        }

        const entries: Record<string, Record<string, string>> = {};
        let group = "";
        entries[group] = {};
        for (const line of fileLines) {
            // New group
            if (line.startsWith("[") && line.endsWith("]") && !line.slice(1, -1).match(/\[\]/m)) {
                if (entries[line]) throw `Ini Format Error! Duplicate groups found in ${fileString}`;
                group = line.slice(1, -1);
                entries[group] = {};
            } else {
                // Entry
                const [key, ...entrySplit] = line.split("=").map((text) => text.trim());
                const entry = entrySplit.join("=");
                if (entries[group][key]) throw `Ini Format Error! Duplicate key in ${group} in file ${fileString}`;
                entries[group][key] = entry;
            }
        }
        return entries;
    }
}
