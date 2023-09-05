import { Button, Text } from "@fluentui/react-components";
import { ArrowLeft16Filled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type HeaderProps = {
    onCloseSettingsClicked: () => void;
};

export const Header = ({ onCloseSettingsClicked }: HeaderProps) => {
    const { t } = useTranslation();

    return (
        <div
            className="draggable-area"
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                boxSizing: "border-box",
            }}
        >
            <Button
                size="small"
                appearance="subtle"
                className="non-draggable-area"
                onClick={onCloseSettingsClicked}
                icon={<ArrowLeft16Filled />}
            ></Button>
            <Text weight="semibold" style={{ padding: "0 10px" }}>
                {t("general.settings")}
            </Text>
        </div>
    );
};
