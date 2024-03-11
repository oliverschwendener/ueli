/**
 * Offers methods to parse an ini file content.
 */
export interface IniFileParser {
    /**
     * Parses the given ini file content and returns the result as an object.
     * @param fileString The ini file content, e.g.:
     * ```ini
     * scope = global
     * [database]
     * nuser = dbuser
     * password = dbpassword
     * ```
     * @param [commentDelimiter=';'] The symbol used to indicate comments. Defaults to ';'
     * @param [allowInlineComments] Whether inline comments are parsed. Defaults to false.
     * @returns The parsed ini file content as an object. Global entries are stored in the empty string key.
     */
    parseIniFileContent(
        fileString: string,
        commentDelimiter?: string,
        allowInlineComments?: boolean,
    ): Record<string, unknown>;
}
