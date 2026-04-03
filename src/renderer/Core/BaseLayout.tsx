import { Divider } from "@fluentui/react-components";
import type { KeyboardEvent, ReactNode, RefObject } from "react";

type BaseLayoutProps = {
    header?: ReactNode;
    contentRef?: RefObject<HTMLDivElement>;
    content: ReactNode;
    footer?: ReactNode;
    onKeyDown?: (event: KeyboardEvent) => void;
};

export const BaseLayout = ({ header, content, contentRef, footer, onKeyDown }: BaseLayoutProps) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }} onKeyDown={onKeyDown} tabIndex={-1}>
            {header}
            <Divider appearance="subtle" />
            <div ref={contentRef} style={{ height: "100%", overflowX: "auto", overflowY: "auto" }}>
                {content}
            </div>
            <Divider appearance="subtle" />
            {footer}
        </div>
    );
};
