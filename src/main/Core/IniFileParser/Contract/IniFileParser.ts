export interface IniFileParser {
    parseIniFileContent(fileString: string): Record<string, Record<string, string>>;
}
