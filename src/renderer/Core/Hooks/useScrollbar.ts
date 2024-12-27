import { tokens } from "@fluentui/react-components";

export const useScrollBar = ({ document }: { document: Document }) => {
    document.body.style.setProperty("--scrollbar-background-color", tokens.colorNeutralBackground4);
    document.body.style.setProperty("--scrollbar-foreground-color", tokens.colorNeutralForeground4);
};
