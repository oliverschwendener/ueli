import { IniFileParser as IniFileParserInterface } from "./Contract";

export class IniFileParser implements IniFileParserInterface {
    public parseIniFileContent(fileString: string): Record<string, Record<string, string>> {
        const fileContent = fileString
            .trim()
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => !line.startsWith("#") && line !== "");

        const result: Record<string, Record<string, string>> = {};
        let group = "";
        result[group] = {};
        for (const line of fileContent) {
            // Comments
            if (line.startsWith("#") || line === "") continue;
            // New group
            if (line.startsWith("[") && line.endsWith("]") && !line.slice(1, -1).match(/\[\]/m)) {
                if (result[line]) throw `Ini Format Error! Duplicate groups found in ${fileString}`;
                group = line.slice(1, -1);
                result[group] = {};
            } else {
                // Entry
                const [key, ...entrySplit] = line.split("=");
                const entry = entrySplit.join("=");
                if (result[group][key]) throw `Ini Format Error! Duplicate key in ${group} in file ${fileString}`;
                result[group][key] = entry;
            }
        }
        return result;
    }
}
