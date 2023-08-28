import { Theme } from "@fluentui/react-components";

export const useScrollBar = (theme: Theme) => {
    document.body.style.setProperty("--scrollbar-background-color", theme.colorNeutralBackground4);
    document.body.style.setProperty("--scrollbar-foreground-color", theme.colorNeutralForeground4);
};
