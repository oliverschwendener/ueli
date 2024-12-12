/**
 * Offers a method to parse XML content.
 */
export interface XmlParser {
    /**
     * Parses the given XML string and returns the result as an object.
     * @param xml - The XML string to be parsed.
     * @param [options] - Optional settings for parsing.
     * @param options.preserveOrder - Whether to preserve the order of elements.
     * @param options.ignoreAttributes - Whether to ignore attributes in the XML.
     * @returns The parsed result.
     */
    parse<T>(xml: string, options?: { preserveOrder: boolean; ignoreAttributes: boolean }): T;
}
