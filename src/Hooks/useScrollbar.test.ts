import { Theme } from "@fluentui/react-components";
import { describe, expect, it, vi } from "vitest";
import { useScrollBar } from "./useScrollbar";

describe(useScrollBar, () => {
    it("should add scrollbar css variables according to the theme", () => {
        const mock = vi.fn();

        const document = <Document>{
            body: {
                style: {
                    setProperty: (property, value) => mock(property, value),
                },
            },
        };

        const theme = <Theme>{
            colorNeutralBackground4: "colorNeutralBackground4",
            colorNeutralForeground4: "colorNeutralForeground4",
        };

        useScrollBar({ document, theme });

        expect(mock).toHaveBeenCalledWith("--scrollbar-background-color", theme.colorNeutralBackground4);
        expect(mock).toHaveBeenCalledWith("--scrollbar-foreground-color", theme.colorNeutralForeground4);
    });
});
