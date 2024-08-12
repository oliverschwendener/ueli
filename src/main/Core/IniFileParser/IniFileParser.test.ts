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

    it("should be able to handle \r\n line endings", () => {
        const iniFileString =
            "[Profile1]\r\nName=default\r\nIsRelative=1\r\nPath=Profiles/f0u1l8pa.default\r\nDefault=1\r\n\r\n" +
            "[Profile0]\r\nName=default-release\r\nIsRelative=1\r\nPath=Profiles/0p40tli3.default-release";

        const iniFileContent = new IniFileParser().parseIniFileContent(iniFileString.trim());

        expect(iniFileContent).toEqual({
            "": {},
            Profile1: {
                Name: "default",
                IsRelative: "1",
                Path: "Profiles/f0u1l8pa.default",
                Default: "1",
            },
            Profile0: {
                Name: "default-release",
                IsRelative: "1",
                Path: "Profiles/0p40tli3.default-release",
            },
        });
    });

    it("should throw an error on duplicate group entries", () => {
        const iniFileString = `
; This comment is being ignored
scope = global
comments = no;inline;comments

[database]
user = dbuser
password = dbpassword
database = use_this_database

[database]
datadir = /var/lib/data
                `;

        expect(() => new IniFileParser().parseIniFileContent(iniFileString.trim())).toThrowError();
    });

    it("should throw an error on duplicate key entries", () => {
        const iniFileString = `
; This comment is being ignored
scope = global
comments = no;inline;comments

[database]
user = dbuser
password = dbpassword
database = use_this_database
user = notdbuser

[paths.default]
datadir = /var/lib/data
                `;

        expect(() => new IniFileParser().parseIniFileContent(iniFileString.trim())).toThrowError();
    });
});
