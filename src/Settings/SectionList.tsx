import { ReactNode } from "react";

type SectionListProps = {
    children?: ReactNode;
};

export const SectionList = ({ children }: SectionListProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
            }}
        >
            {children}
        </div>
    );
};
