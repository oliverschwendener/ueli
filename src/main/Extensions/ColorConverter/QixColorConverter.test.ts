import { describe, expect, it } from "vitest";
import { QixColorConverter } from "./QixColorConverter";

describe(QixColorConverter, () => {
    describe(QixColorConverter.prototype.convertFromString, () => {
        it("should return an empty array when the input can't be parsed as a color", () => {
            expect(new QixColorConverter().convertFromString("")).toEqual([]);
            expect(new QixColorConverter().convertFromString(" ")).toEqual([]);
            expect(new QixColorConverter().convertFromString("1234")).toEqual([]);
            expect(new QixColorConverter().convertFromString("invalid input")).toEqual([]);
            expect(new QixColorConverter().convertFromString("#")).toEqual([]);
            expect(new QixColorConverter().convertFromString("#ff")).toEqual([]);
            expect(new QixColorConverter().convertFromString("#ffg")).toEqual([]);
            expect(new QixColorConverter().convertFromString("rgb")).toEqual([]);
            expect(new QixColorConverter().convertFromString("rgb()")).toEqual([]);
            expect(new QixColorConverter().convertFromString("rgb(1)")).toEqual([]);
            expect(new QixColorConverter().convertFromString("rgb(1,2)")).toEqual([]);
            expect(new QixColorConverter().convertFromString("rgb(1,2,4,5,6)")).toEqual([]);
        });

        it("should be able to parse hex colors", () => {
            expect(new QixColorConverter().convertFromString("#fff")).toEqual([
                { colorSystem: "HEX", value: "#FFFFFF" },
                { colorSystem: "HLS", value: "hsl(0, 0%, 100%)" },
                { colorSystem: "RGB", value: "rgb(255, 255, 255)" },
            ]);

            expect(new QixColorConverter().convertFromString("#ffffff")).toEqual([
                { colorSystem: "HEX", value: "#FFFFFF" },
                { colorSystem: "HLS", value: "hsl(0, 0%, 100%)" },
                { colorSystem: "RGB", value: "rgb(255, 255, 255)" },
            ]);
        });

        it("should be able to parse rgb colors", () => {
            expect(new QixColorConverter().convertFromString("rgb(255,255,255)")).toEqual([
                { colorSystem: "HEX", value: "#FFFFFF" },
                { colorSystem: "HLS", value: "hsl(0, 0%, 100%)" },
                { colorSystem: "RGB", value: "rgb(255, 255, 255)" },
            ]);

            expect(new QixColorConverter().convertFromString("rgba(255,255,255,1)")).toEqual([
                { colorSystem: "HEX", value: "#FFFFFF" },
                { colorSystem: "HLS", value: "hsl(0, 0%, 100%)" },
                { colorSystem: "RGB", value: "rgb(255, 255, 255)" },
            ]);
        });
    });
});
