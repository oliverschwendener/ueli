import { parse } from "ini";
import { IniFileParser as IniFileParserInterface } from "./Contract";

export class IniFileParser implements IniFileParserInterface {
    public parseIniFileContent(fileString: string): Record<string, unknown> {
        return parse(fileString);
    }
}
