import { Text } from "@fluentui/react-components";
import type { ReactElement } from "react";

type HeaderProps = {
    text: string;
    contentBefore?: ReactElement;
    draggable?: boolean;
};

export const Header = ({ draggable, contentBefore, text }: HeaderProps) => {
    return (
        <div
            className={draggable ? "draggable-area" : ""}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                boxSizing: "border-box",
            }}
        >
            {contentBefore}
            <Text weight="semibold" style={{ padding: "0 10px" }}>
                {text}
            </Text>
        </div>
    );
};
