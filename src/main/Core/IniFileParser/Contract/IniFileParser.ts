/**
 * Offers methods to parse an ini file content.
 */
export interface IniFileParser {
    /**
     * Parses the given ini file content and returns the result as an object.
     * @param {string} fileString The ini file content, e.g.:
     * ```ini
     * scope = global
     * [database]
     * nuser = dbuser
     * password = dbpassword
     * ```
     * @param {string} [commentDelimiter=';'] The symbol used to indicate comments
     * @param {boolean} [allowInlineComments] Whether inline comments are parsed
     * @returns The parsed ini file content as an object. Global entries are stored in the empty string key.
     */
    parseIniFileContent(fileString: string, commentDelimiter?: string, allowInlineComments?: boolean): Record<string, unknown>;
}
