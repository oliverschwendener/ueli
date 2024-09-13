import { describe, expect, it } from "vitest";
import { XmlParser } from "./XmlParser";

describe(XmlParser, () => {
    describe(XmlParser.prototype.parse, () => {
        it("should read and parse XML file content", async () => {
            const xml = "<root><test>test</test></root>";
            const actual = new XmlParser().parse(xml, { ignoreAttributes: true, preserveOrder: true });
            const expected = [{ root: [{ test: [{ "#text": "test" }] }] }];

            expect(actual).toEqual(expected);
        });
    });
});
