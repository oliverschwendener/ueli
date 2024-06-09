import { Text } from "@fluentui/react-components";
import type { ReactNode } from "react";

type SectionListProps = {
    title?: string;
    children?: ReactNode;
};

export const SettingGroup = ({ title, children }: SectionListProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
            }}
        >
            {title && (
                <Text weight="semibold" size={300}>
                    {title}
                </Text>
            )}
            {children}
        </div>
    );
};
