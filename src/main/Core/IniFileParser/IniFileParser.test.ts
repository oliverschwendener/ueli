import { describe, expect, it } from "vitest";
import { IniFileParser } from "./IniFileParser";

describe(IniFileParser, () => {
    it("should parse an ini file", () => {
        const iniFileString = `
# This comment is being ignored
scope = global

[database]
user = dbuser
password = dbpassword
database = use_this_database

[paths.default]
datadir = /var/lib/data
        `;

        expect(new IniFileParser().parseIniFileContent(iniFileString.trim())).toEqual({
            "": {
                scope: "global",
            },
            database: {
                user: "dbuser",
                password: "dbpassword",
                database: "use_this_database",
            },
            "paths.default": {
                datadir: "/var/lib/data",
            },
        });
    });
});
