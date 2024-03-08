import { describe, expect, it } from "vitest";
import { IniFileParser } from "./IniFileParser";

describe(IniFileParser, () => {
    it("should parse an ini file", () => {
        const iniFileString = `
; This comment is being ignored
scope = global

[database]
user = dbuser
password = dbpassword
database = use_this_database

[paths.default]
datadir = /var/lib/data
array[] = first value
array[] = second value
array[] = third value
        `;

        expect(new IniFileParser().parseIniFileContent(iniFileString.trim())).toEqual({
            database: {
                database: "use_this_database",
                password: "dbpassword",
                user: "dbuser",
            },
            paths: {
                default: {
                    array: ["first value", "second value", "third value"],
                    datadir: "/var/lib/data",
                },
            },
            scope: "global",
        });
    });
});
