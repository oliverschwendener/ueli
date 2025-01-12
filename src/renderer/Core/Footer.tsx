import type { ReactNode } from "react";

type FooterProps = {
    children?: ReactNode;
    draggable?: boolean;
};

export const Footer = ({ children, draggable }: FooterProps) => {
    return (
        <div
            className={draggable ? "draggable-area" : ""}
            style={{
                flexShrink: 0,
                padding: 8,
                gap: 10,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {children}
        </div>
    );
};
