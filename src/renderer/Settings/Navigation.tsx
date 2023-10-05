import { Tab, TabList } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { SettingsPage } from "./Pages";

type NavigationProps = {
    path: string;
    settingsPages: SettingsPage[];
    onNavigate: (path: string) => void;
};

export const Navigation = ({ settingsPages, path, onNavigate }: NavigationProps) => {
    const { t } = useTranslation();

    return (
        <TabList
            selectedValue={path}
            onTabSelect={(_, { value }) => (typeof value === "string" ? onNavigate(value) : null)}
            vertical
            appearance="subtle"
            style={{ width: "100%" }}
        >
            {settingsPages.map(({ translationKey, absolutePath, icon }) => (
                <Tab key={`settings-page-tab-${absolutePath}`} value={absolutePath} icon={icon}>
                    {t(translationKey)}
                </Tab>
            ))}
        </TabList>
    );
};
