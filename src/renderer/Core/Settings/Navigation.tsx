import { Tab, TabList } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { SettingsPage } from "./Pages";

type NavigationProps = {
    settingsPages: SettingsPage[];
    onNavigate: (path: string) => void;
};

export const Navigation = ({ settingsPages, onNavigate }: NavigationProps) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    return (
        <TabList
            selectedValue={pathname}
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
