import type { Theme } from "@fluentui/react-components";

export type ThemeMap = Record<
    string,
    {
        dark: {
            theme: Theme;
            accentColor: string;
        };
        light: {
            theme: Theme;
            accentColor: string;
        };
    }
>;
