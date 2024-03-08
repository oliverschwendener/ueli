export interface IniFileParser {
    parseIniFileContent(fileString: string): Record<string, unknown>;
}
