import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { Header } from "../Header";

type SettingsHeaderProps = {
    onCloseSettingsClicked: () => void;
};

export const SettingsHeader = ({ onCloseSettingsClicked }: SettingsHeaderProps) => {
    const { t } = useTranslation();

    return (
        <Header
            draggable
            contentBefore={
                <Button
                    size="small"
                    appearance="subtle"
                    className="non-draggable-area"
                    onClick={onCloseSettingsClicked}
                    icon={<ArrowLeftFilled fontSize={14} />}
                ></Button>
            }
        >
            <Text weight="semibold">{t("settings", { ns: "settingsGeneral" })}</Text>
        </Header>
    );
};
