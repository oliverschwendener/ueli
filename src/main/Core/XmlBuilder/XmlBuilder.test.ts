import { describe, expect, it } from "vitest";
import { XmlBuilder } from "./XmlBuilder";

describe(XmlBuilder, () => {
    describe(XmlBuilder.prototype.build, () => {
        it("should build and format XML file content", async () => {
            const xml = { root: { test: "test" } };
            const actual = new XmlBuilder().build(xml, {
                format: true,
                indentBy: "  ",
                ignoreAttributes: true,
                processEntities: true,
            });
            const expected = "<root>\n  <test>test</test>\n</root>\n";

            expect(actual).toEqual(expected);
        });
    });
});
