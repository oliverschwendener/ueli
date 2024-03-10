import { IniFileParser as IniFileParserInterface } from "./Contract";

export class IniFileParser implements IniFileParserInterface {
    public parseIniFileContent(fileString: string): Record<string, unknown> {
        const fileContent = fileString.split("\n").filter((v) => !v.startsWith("#") && v !== "");
        const entries: Record<string, Record<string, string>> = {};
        let group = "";
        entries[group] = {};
        for (const line of fileContent) {
            // Comments
            if (line.startsWith("#") || line.trim() === "") {
                continue;
            }

            // New group
            if (line.startsWith("[") && line.endsWith("]") && !line.slice(1, -1).match(/\[\]/m)) {
                if (entries[line]) {
                    throw `Ini Format Error! Duplicate groups found in ${fileString}`;
                }

                group = line.slice(1, -1);
                entries[group] = {};
            } else {
                // Entry
                const [key, ...entrySplit] = line.split("=");
                const entry = entrySplit.join("=");

                if (entries[group][key.trim()]) {
                    throw `Ini Format Error! Duplicate key in ${group} in file ${fileString}`;
                }

                entries[group][key.trim()] = entry.trim();
            }
        }
        return entries;
    }
}
