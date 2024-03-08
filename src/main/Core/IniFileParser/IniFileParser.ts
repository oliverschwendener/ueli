import { parse } from "ini";
import { IniFileParser as IniFileParserInterface } from "./Contract";

export class IniFileParser implements IniFileParserInterface {
    public parseIniFileContent(fileString: string): Record<string, Record<string, string>> {
        return parse(fileString);
    }
}
