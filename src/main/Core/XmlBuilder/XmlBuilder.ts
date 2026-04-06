import { XMLBuilder } from "fast-xml-parser";
import type { XmlBuilder as XmlBuilderInterface } from "./Contract";

export class XmlBuilder implements XmlBuilderInterface {
    public build(
        obj: unknown,
        options?: { format: boolean; indentBy: string; ignoreAttributes: boolean; processEntities: boolean },
    ): string {
        return new XMLBuilder(options).build(obj);
    }
}
