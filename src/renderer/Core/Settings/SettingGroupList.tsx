import type { ReactNode } from "react";

type SectionListProps = {
    children?: ReactNode;
};

export const SettingGroupList = ({ children }: SectionListProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
            }}
        >
            {children}
        </div>
    );
};
