import type { ReactNode } from "react";

type SectionProps = {
    children?: ReactNode;
};

export const Section = ({ children }: SectionProps) => {
    return <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{children}</div>;
};
