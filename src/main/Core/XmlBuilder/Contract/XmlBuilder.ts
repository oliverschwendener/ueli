/**
 * Offers a method to build XML content.
 */
export interface XmlBuilder {
    /**
     * Builds XML from the given object.
     * @param obj - The object to be converted to XML.
     * @param [options] - Optional settings for building.
     * @param options.format - Whether to format the output.
     * @param options.indentBy - The string to use for indentation.
     * @param options.ignoreAttributes - Whether to ignore attributes in the XML.
     * @param options.processEntities - Whether to process entities in the XML.
     * @returns The built XML string.
     */
    build<T extends object>(
        obj: T,
        options?: { format: boolean; indentBy: string; ignoreAttributes: boolean; processEntities: boolean },
    ): string;
}
