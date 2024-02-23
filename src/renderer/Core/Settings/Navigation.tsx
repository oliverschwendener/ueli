import { useContextBridge } from "@Core/Hooks";
import { getImageUrl } from "@Core/getImageUrl";
import { ExtensionInfo } from "@common/Core";
import { Tab, TabList } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { SettingsPage } from "./Pages";

type NavigationProps = {
    settingsPages: SettingsPage[];
    enabledExtensions: ExtensionInfo[];
};

export const Navigation = ({ settingsPages, enabledExtensions }: NavigationProps) => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <TabList
            selectedValue={pathname}
            onTabSelect={(_, { value }) => navigate({ pathname: value as string })}
            vertical
            appearance="subtle"
            style={{ width: "100%" }}
        >
            {settingsPages.map(({ translation, absolutePath, icon }, i) => (
                <Tab
                    style={{ marginBottom: settingsPages.length - 1 === i ? 10 : undefined }}
                    key={`settings-page-tab-${absolutePath}`}
                    value={absolutePath}
                    icon={icon}
                >
                    {t(translation.key, { ns: translation.namespace })}
                </Tab>
            ))}
            {enabledExtensions.map((e) => (
                <Tab key={`extension-settings-tab-${e.id}`} value={`/settings/extension/${e.id}`}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <img
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                                src={getImageUrl({
                                    image: e.image,
                                    shouldPreferDarkColors: contextBridge.themeShouldUseDarkColors(),
                                })}
                            />
                        </div>
                        {e.nameTranslation ? t(e.nameTranslation.key, { ns: e.nameTranslation.namespace }) : e.name}
                    </div>
                </Tab>
            ))}
        </TabList>
    );
};
