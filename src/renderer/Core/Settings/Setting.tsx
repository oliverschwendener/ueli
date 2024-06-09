import { Body1, Caption1, Card } from "@fluentui/react-components";
import type { ReactElement } from "react";

type SettingSectionProps = {
    label: string;
    description?: string;
    control: ReactElement;
};

export const Setting = ({ control, label, description }: SettingSectionProps) => {
    return (
        <Card appearance="outline">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                }}
            >
                <div style={{ flexShrink: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Body1>{label}</Body1>
                        {description && <Caption1>{description}</Caption1>}
                    </div>
                </div>
                <div
                    style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    {control}
                </div>
            </div>
        </Card>
    );
};
