import type { ReactElement, ReactNode } from "react";

type HeaderProps = {
    children: ReactNode;
    contentBefore?: ReactElement;
    draggable?: boolean;
};

export const Header = ({ draggable, contentBefore, children }: HeaderProps) => {
    return (
        <div
            className={draggable ? "draggable-area" : ""}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                boxSizing: "border-box",
                gap: 10,
            }}
        >
            {contentBefore}
            {children}
        </div>
    );
};
