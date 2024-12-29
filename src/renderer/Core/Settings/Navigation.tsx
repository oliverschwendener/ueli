import type { ExtensionInfo } from "@common/Core";
import { getImageUrl } from "@Core/getImageUrl";
import { ThemeContext } from "@Core/Theme";
import { NavDivider, NavDrawer, NavDrawerBody, NavItem, NavSectionHeader } from "@fluentui/react-nav-preview";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import type { SettingsPage } from "./Pages";

type NavigationProps = {
    settingsPages: SettingsPage[];
    enabledExtensions: ExtensionInfo[];
};

export const Navigation = ({ settingsPages, enabledExtensions }: NavigationProps) => {
    const { shouldUseDarkColors } = useContext(ThemeContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <NavDrawer
            open
            type="inline"
            selectedValue={pathname}
            onNavItemSelect={(_, { value }) => navigate(value)}
            size="small"
        >
            <NavDrawerBody>
                <NavSectionHeader>{t("generalSettings", { ns: "general" })}</NavSectionHeader>
                {settingsPages.map(({ translation, absolutePath, icon }) => (
                    <NavItem
                        key={`settings-page-tab-${absolutePath}`}
                        value={absolutePath}
                        onFocus={() => navigate(absolutePath)}
                        icon={icon}
                    >
                        {t(translation.key, { ns: translation.namespace })}
                    </NavItem>
                ))}
                <NavDivider />
                <NavSectionHeader>{t("extensionSettings", { ns: "general" })}</NavSectionHeader>
                {enabledExtensions.map(({ id, name, nameTranslation, image }) => (
                    <NavItem
                        key={`extension-settings-tab-${id}`}
                        value={`/extension/${id}`}
                        onFocus={() => navigate(`/extension/${id}`)}
                        icon={
                            <div
                                style={{
                                    width: 16,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    alt={name}
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                    src={getImageUrl({ image, shouldUseDarkColors })}
                                />
                            </div>
                        }
                    >
                        {nameTranslation ? t(nameTranslation.key, { ns: nameTranslation.namespace }) : name}
                    </NavItem>
                ))}
            </NavDrawerBody>
        </NavDrawer>
    );
};
