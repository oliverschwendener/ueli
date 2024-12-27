import type { Theme } from "@fluentui/react-components";

export const useScrollBar = ({ fluentUiTheme }: { fluentUiTheme: Theme }) => {
    document.body.style.setProperty("--scrollbar-background-color", fluentUiTheme.colorNeutralBackground4);
    document.body.style.setProperty("--scrollbar-foreground-color", fluentUiTheme.colorNeutralForeground4);
};
