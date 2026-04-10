import { XmlBuilder } from "@Core/XmlBuilder/XmlBuilder";
import { XmlParser } from "@Core/XmlParser/XmlParser";
import { describe, expect, it } from "vitest";
import { QuickFormatter } from "./QuickFormatter";

const quickFormatter = new QuickFormatter(new XmlBuilder(), new XmlParser());

describe("QuickFormatter", () => {
    describe("formatJson", () => {
        it("should format simple JSON without deep formatting", () => {
            const input = '{"name":"Alice","age":30}';
            const result = quickFormatter.formatJson(input, false);
            const expected = '{\n  "name": "Alice",\n  "age": 30\n}';
            expect(result).toBe(expected);
        });

        it("should format nested JSON without deep formatting", () => {
            const input = '{"user":{"name":"Alice","age":30}}';
            const result = quickFormatter.formatJson(input, false);
            const expected = '{\n  "user": {\n    "name": "Alice",\n    "age": 30\n  }\n}';
            expect(result).toBe(expected);
        });

        it("should detect and format deeply nested JSON with deep formatting", () => {
            const input = String.raw`{"data":"{\"name\":\"Bob\",\"age\":25}"}`;
            const result = quickFormatter.formatJson(input, true);
            const expected = '{\n  "data": {\n    "name": "Bob",\n    "age": 25\n  }\n}';
            expect(result).toBe(expected);
        });

        it("should return original string on invalid JSON", () => {
            const input = '{"invalid": json}';
            const result = quickFormatter.formatJson(input, false);
            const expected = '{"invalid": json}';
            expect(result).toBe(expected);
        });

        it("should handle empty objects and arrays", () => {
            const inputEmptyObject = "{}";
            const resultEmptyObject = quickFormatter.formatJson(inputEmptyObject, false);
            const expectedEmptyObject = "{}";
            expect(resultEmptyObject).toBe(expectedEmptyObject);

            const inputEmptyArray = "[]";
            const resultEmptyArray = quickFormatter.formatJson(inputEmptyArray, false);
            const expectedEmptyArray = "[]";
            expect(resultEmptyArray).toBe(expectedEmptyArray);
        });

        it("should handle JSON with arrays", () => {
            const input = '[{"name":"Alice"},{"name":"Bob"}]';
            const result = quickFormatter.formatJson(input, false);
            const expected = '[\n  {\n    "name": "Alice"\n  },\n  {\n    "name": "Bob"\n  }\n]';
            expect(result).toBe(expected);
        });
    });

    describe("formatXml", () => {
        it("should format simple XML without deep formatting", () => {
            const input = "<root><name>Alice</name></root>";
            const result = quickFormatter.formatXml(input, false);
            const expected = "<root>\n  <name>Alice</name>\n</root>";
            expect(result).toBe(expected);
        });

        it("should format XML with attributes", () => {
            const input = '<root id="1"><name>Alice</name></root>';
            const result = quickFormatter.formatXml(input, false);
            const expected = '<root id="1">\n  <name>Alice</name>\n</root>';
            expect(result).toBe(expected);
        });

        it("should decode and format escaped XML with deep formatting", () => {
            const input = "<test>&lt;root&gt;&lt;name&gt;Alice&lt;/name&gt;&lt;/root&gt;</test>";
            const result = quickFormatter.formatXml(input, true);
            const expected = "<test>\n  <root>\n    <name>Alice</name>\n  </root>\n</test>";
            expect(result).toBe(expected);
        });

        it("should handle XML with special characters", () => {
            const input = "<root><name>Alice &amp; Bob</name></root>";
            const result = quickFormatter.formatXml(input, false);
            const expected = "<root>\n  <name>Alice &amp; Bob</name>\n</root>";
            expect(result).toBe(expected);
        });
    });

    describe("formatStackTrace", () => {
        it("should format basic stack trace", () => {
            const input = "Error: Something went wrong\n  at line 5\n  at line 10";
            const result = quickFormatter.formatStackTrace(input, false);
            const expected = "Error: Something went wrong\n  at line 5\n  at line 10";
            expect(result).toBe(expected);
        });

        it("should handle escaped newlines in stack trace", () => {
            const input = String.raw`Error\nat something\nat somewhere`;
            const result = quickFormatter.formatStackTrace(input, false);
            const expected = "Error\n  at something\n  at somewhere";
            expect(result).toBe(expected);
        });

        it("should indent stack frames with deep formatting", () => {
            const input = "Error\nat function1\nat function2";
            const result = quickFormatter.formatStackTrace(input, true);
            const expected = "Error\n  at function1\n  at function2";
            expect(result).toBe(expected);
        });

        it("should remove duplicate empty lines", () => {
            const input = "Error\n\n\nat line 5\n\n\nat line 10";
            const result = quickFormatter.formatStackTrace(input, false);
            const expected = "Error\n\n  at line 5\n\n  at line 10";
            expect(result).toBe(expected);
        });

        it("should handle mixed line endings", () => {
            const input = "Error\r\nat line 5\rat line 10\nat line 15";
            const result = quickFormatter.formatStackTrace(input, false);
            const expected = "Error\n  at line 5\n  at line 10\n  at line 15";
            expect(result).toBe(expected);
        });
    });

    describe("formatAuto", () => {
        it("should detect and format JSON", () => {
            const input = '{"name":"Alice"}';
            const result = quickFormatter.formatAuto(input, false);
            const expected = '{\n  "name": "Alice"\n}';
            expect(result).toBe(expected);
        });

        it("should detect and format XML", () => {
            const input = "<root><name>Alice</name></root>";
            const result = quickFormatter.formatAuto(input, false);
            const expected = "<root>\n  <name>Alice</name>\n</root>";
            expect(result).toBe(expected);
        });

        it("should detect and format stack trace", () => {
            const input = "Error\nat function1\nat function2";
            const result = quickFormatter.formatAuto(input, false);
            const expected = "Error\n  at function1\n  at function2";
            expect(result).toBe(expected);
        });

        it("should handle empty and whitespace input", () => {
            const input1 = "";
            const result1 = quickFormatter.formatAuto(input1, false);
            const expected1 = "";
            expect(result1).toBe(expected1);

            const input2 = "   ";
            const result2 = quickFormatter.formatAuto(input2, false);
            const expected2 = "   ";
            expect(result2).toBe(expected2);
        });
    });

    describe("Mixed nested formatting (deep formatting)", () => {
        it("should format JSON containing nested JSON with deep formatting", () => {
            const input = String.raw`{"name":"Alice","meta":"{\"age\":30}"}`;
            const result = quickFormatter.formatAuto(input, true);
            const expected = '{\n  "name": "Alice",\n  "meta": {\n    "age": 30\n  }\n}';
            expect(result).toBe(expected);
        });

        it("should format JSON containing nested XML with deep formatting", () => {
            const input = '{"name":"Alice","xml":"<root><name>Bob</name></root>"}';
            const result = quickFormatter.formatAuto(input, true);
            const expected = '{\n  "name": "Alice",\n  "xml": "<root>\n  <name>Bob</name>\n</root>"\n}';
            expect(result).toBe(expected);
        });

        it("should handle deeply nested JSON and XML combinations", () => {
            const input = String.raw`{"name":"Alice","meta":"{\"address\":\"<test>&lt;root&gt;&lt;name&gt;Bob&lt;/name&gt;&lt;/root&gt;</test>\"}"}`;
            const result = quickFormatter.formatAuto(input, true);
            const expected =
                '{\n  "name": "Alice",\n  "meta": {\n    "address": "<test>\n  <root>\n    <name>Bob</name>\n  </root>\n</test>"\n  }\n}';
            expect(result).toBe(expected);
        });

        it("should format XML containing nested JSON with deep formatting", () => {
            const input = '<root><data>{"name":"Alice","age":30}</data></root>';
            const result = quickFormatter.formatAuto(input, true);
            const expected = '<root>\n  <data>{\n  "name": "Alice",\n  "age": 30\n}</data>\n</root>';
            expect(result).toBe(expected);
        });

        it("should format stack trace containing nested JSON with deep formatting", () => {
            const input = 'Error\nat {"key":"value"}';
            const result = quickFormatter.formatAuto(input, true);
            const expected = 'Error\n  at {\n  "key": "value"\n}';
            expect(result).toBe(expected);
        });

        it("should format stack trace containing nested XML with deep formatting", () => {
            const input = "Error\nat <data><key>value</key></data>";
            const result = quickFormatter.formatAuto(input, true);
            const expected = "Error\n  at <data>\n  <key>value</key>\n</data>";
            expect(result).toBe(expected);
        });

        it("should preserve real newlines in output when deep formatting nested content", () => {
            const input = String.raw`{"name":"Alice","meta":"{\"xml\":\"<root><name>Bob</name></root>\"}"}`;
            const result = quickFormatter.formatAuto(input, true);
            const expected =
                '{\n  "name": "Alice",\n  "meta": {\n    "xml": "<root>\n  <name>Bob</name>\n</root>"\n  }\n}';
            expect(result).toBe(expected);
        });
    });

    describe("Edge cases", () => {
        it("should handle null and undefined gracefully", () => {
            const input = '{"value":null}';
            const result = quickFormatter.formatJson(input, false);
            const expected = '{\n  "value": null\n}';
            expect(result).toBe(expected);
        });

        it("should handle numbers and booleans", () => {
            const input = '{"num":42,"bool":true}';
            const result = quickFormatter.formatJson(input, false);
            const expected = '{\n  "num": 42,\n  "bool": true\n}';
            expect(result).toBe(expected);
        });

        it("should handle escaped quotes in JSON strings", () => {
            const input = String.raw`{"quote":"He said \"hello\""}`;
            const result = quickFormatter.formatJson(input, false);
            const expected = '{\n  "quote": "He said \\"hello\\""\n}';
            expect(result).toBe(expected);
        });

        it("should handle XML with namespaces", () => {
            const input = '<root xmlns="http://example.com"><name>Alice</name></root>';
            const result = quickFormatter.formatXml(input, false);
            const expected = '<root xmlns="http://example.com">\n  <name>Alice</name>\n</root>';
            expect(result).toBe(expected);
        });

        it("should handle very large JSON objects", () => {
            const largeObject = JSON.stringify(
                Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`key${i}`, `value${i}`])),
            );
            const result = quickFormatter.formatJson(largeObject, false);
            const expected =
                '{\n  "key0": "value0",\n  "key1": "value1",\n  "key2": "value2",\n  "key3": "value3",\n  "key4": "value4",\n  "key5": "value5",\n  "key6": "value6",\n  "key7": "value7",\n  "key8": "value8",\n  "key9": "value9"\n}';
            expect(result).toBe(expected);
        });

        it("should handle XML with encoded tags only", () => {
            const input = '&lt;root xmlns="http://example.com"&gt;&lt;name&gt;Alice&lt;/name&gt;&lt;/root&gt;';
            const result = quickFormatter.formatXml(input, true);
            const expected = '<root xmlns="http://example.com">\n  <name>Alice</name>\n</root>';
            expect(result).toBe(expected);
        });
    });

    describe("Direct method calls", () => {
        it("formatJson should not auto-detect nested other formats", () => {
            const input = '{"xml":"<root>test</root>"}';
            const result = quickFormatter.formatJson(input, false);
            const expected = '{\n  "xml": "<root>test</root>"\n}';
            expect(result).toBe(expected);
        });

        it("formatXml should only format embedded XML, not other types", () => {
            const input = "<root>&lt;child&gt;test&lt;/child&gt;</root>";
            const result = quickFormatter.formatXml(input, false);
            const expected = "<root>&lt;child&gt;test&lt;/child&gt;</root>";
            expect(result).toBe(expected);
        });

        it("formatStackTrace should not auto-detect other formats without deep formatting", () => {
            const input = 'Error\nat {"key":"value"}';
            const result = quickFormatter.formatStackTrace(input, false);
            const expected = 'Error\n  at {"key":"value"}';
            expect(result).toBe(expected);
        });
    });

    describe("Formatting consistency", () => {
        it("formatting twice should produce consistent results for JSON", () => {
            const input = '{"a":{"b":"c"}}';
            const result1 = quickFormatter.formatJson(input, false);
            const result2 = quickFormatter.formatJson(result1, false);
            expect(result1).toBe(result2);
        });

        it("formatAuto with false should match direct method calls for JSON", () => {
            const input = '{"name":"Alice"}';
            const result1 = quickFormatter.formatAuto(input, false);
            const result2 = quickFormatter.formatJson(input, false);
            expect(result1).toBe(result2);
        });

        it("formatAuto with false should match direct method calls for XML", () => {
            const input = "<root><name>Alice</name></root>";
            const result1 = quickFormatter.formatAuto(input, false);
            const result2 = quickFormatter.formatXml(input, false);
            expect(result1).toBe(result2);
        });
    });
});
