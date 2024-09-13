import { XMLParser } from "fast-xml-parser";
import type { XmlParser as XmlParserInterface } from "./Contract";

export class XmlParser implements XmlParserInterface {
    public parse<T>(xml: string, options?: { preserveOrder: boolean; ignoreAttributes: boolean }): T {
        return new XMLParser(options).parse(xml);
    }
}
