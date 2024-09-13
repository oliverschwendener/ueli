/**
 * TODO: add description
 */
export interface XmlParser {
    /**
     * TODO: add description
     *
     * @param xml TODO: add description
     * @param options TODO: add description
     * @return TODO: add description
     */
    parse<T>(xml: string, options?: { preserveOrder: boolean; ignoreAttributes: boolean }): T;
}
