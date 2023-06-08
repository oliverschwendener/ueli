import { Button, Text } from "@fluentui/react-components";
import {
    Dismiss16Filled,
    Dismiss24Filled,
    DismissCircle16Filled,
    DismissCircle24Filled,
    DismissCircle28Filled,
    DismissCircle32Filled,
    DismissCircle48Filled,
} from "@fluentui/react-icons";
import { FC } from "react";

type HeaderProps = {
    onCloseSettingsClicked: () => void;
};

export const Header: FC<HeaderProps> = ({ onCloseSettingsClicked }) => {
    return (
        <div
            className="draggable-area"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                boxSizing: "border-box",
            }}
        >
            <Text weight="semibold" style={{ padding: "0 10px" }}>
                Settings
            </Text>
            <Button
                className="non-draggable-area"
                appearance="transparent"
                onClick={onCloseSettingsClicked}
                icon={<DismissCircle24Filled />}
            ></Button>
        </div>
    );
};
