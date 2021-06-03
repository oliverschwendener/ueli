import { isValidIconType, isValidIcon } from "./icon-helpers";
import { IconType } from "./icon-type";
import { Icon } from "./icon";

describe(isValidIconType.name, () => {
    it("should return true if passing in a valid icon type", () => {
        const validIconTypes = Object.values(IconType) as IconType[];
        validIconTypes.forEach((validIconType) => {
            const actual = isValidIconType(validIconType);
            expect(actual).toBe(true);
        });
    });

    it("should return false if passing in an invalid icon type", () => {
        const invalidIconTypes = ["", "abca", "Color", "svg"];

        invalidIconTypes.forEach((invalidIconType) => {
            const actual = isValidIconType(invalidIconType);
            expect(actual).toBe(false);
        });
    });
});

describe(isValidIcon.name, () => {
    it("should return true if passing in a valid icon parameter", () => {
        const validIconParameters: Icon[] = [
            {
                parameter: "myimage",
                type: IconType.URL,
            },
            {
                parameter: "https://someurl.com/image.jpg",
                type: IconType.URL,
            },
            {
                parameter: "something",
                type: IconType.URL,
            },
            {
                parameter: "<svg></svg>",
                type: IconType.SVG,
            },
            {
                parameter: "<svg>....my svg content...</svg>",
                type: IconType.SVG,
            },
            {
                parameter: "   <svg>....my svg content...</svg>   ",
                type: IconType.SVG,
            },
            {
                parameter: "#fff",
                type: IconType.Color,
            },
            {
                parameter: "rgb(255,255,255)",
                type: IconType.Color,
            },
            {
                parameter: "#ffffff",
                type: IconType.Color,
            },
            {
                parameter: "  #fff   ",
                type: IconType.Color,
            },
        ];

        validIconParameters.forEach((validIconParameter) => {
            const actual = isValidIcon(validIconParameter);
            expect(actual).toBe(true);
        });
    });

    it("should return false if passing in an invalid icon parameter", () => {
        const invalidIconParameters: Icon[] = [
            {
                parameter: "",
                type: IconType.URL,
            },
            {
                parameter: "    ",
                type: IconType.URL,
            },
            {
                parameter: "<svg><svg>",
                type: IconType.SVG,
            },
            {
                parameter: "<svg>",
                type: IconType.SVG,
            },
            {
                parameter: "</svg>",
                type: IconType.SVG,
            },
            {
                parameter: "#fffffff",
                type: IconType.Color,
            },
            {
                parameter: "rgb(255,255,)",
                type: IconType.Color,
            },
            {
                parameter: "ffffff",
                type: IconType.Color,
            },
            {
                parameter: "#zzzzzz",
                type: IconType.Color,
            },
            {
                parameter: "#ffffff",
                type: IconType.SVG,
            },
            {
                parameter: "https://url.com/image.jpg",
                type: IconType.SVG,
            },
            {
                parameter: "<svg></svg>",
                type: IconType.Color,
            },
            {
                parameter: "https://url.com/image.jpg",
                type: IconType.Color,
            },
        ];

        invalidIconParameters.forEach((invalidIconParameter) => {
            const actual = isValidIcon(invalidIconParameter);
            expect(actual).toBe(false);
        });
    });
});
