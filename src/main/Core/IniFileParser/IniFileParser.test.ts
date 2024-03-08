import { describe, expect, it } from "vitest";
import { IniFileParser } from "./IniFileParser";

describe(IniFileParser, () => {
    it("should parse an ini file", () => {
        const iniFileString = `
# Comment

[Group1]
key1=value1

[Group2]
key2=value2
        `;

        expect(new IniFileParser().parseIniFileContent(iniFileString)).toEqual({
            Group1: { key1: "value1" },
            Group2: { key2: "value2" },
        });
    });
});
