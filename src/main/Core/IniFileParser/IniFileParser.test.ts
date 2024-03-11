import { describe, expect, it } from "vitest";
import { IniFileParser } from "./IniFileParser";

describe(IniFileParser, () => {
    it("should parse an ini file", () => {
        const iniFileString = `
; This comment is being ignored
scope = global
comments = no;inline;comments

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
                comments: "no;inline;comments",
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

    it("should parse an ini file with a different comment delimiter and inline comments", () => {
        const iniFileString = `
# This comment is being ignored
scope = global
notcomment = this;is;not;a;comment
iscomment = value#an inline comment

[database]
user = dbuser
password = dbpassword
database = use_this_database

[paths.default]
datadir = /var/lib/data
        `;

        expect(new IniFileParser().parseIniFileContent(iniFileString.trim(), "#", true)).toEqual({
            "": {
                scope: "global",
                notcomment: "this;is;not;a;comment",
                iscomment: "value",
            },
            database: {
                database: "use_this_database",
                password: "dbpassword",
                user: "dbuser",
            },
            "paths.default": {
                datadir: "/var/lib/data",
            },
        });
    });
});
