import { darkTheme, lightTheme } from "@Core/Theme/defaultValues";
import { Body1, Button, Dropdown, Input, Option, Tooltip, type BrandVariants } from "@fluentui/react-components";
import { ArrowCounterclockwiseRegular } from "@fluentui/react-icons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../../Hooks";
import { getAvailableThemes, getTheme } from "../../../Theme";
import { ThemeContext } from "../../../ThemeContext";
import { Setting } from "../../Setting";
import { SettingGroup } from "../../SettingGroup";
import { SettingGroupList } from "../../SettingGroupList";
import { ThemeOption } from "../ThemeOption";
import { SearchBarSettings } from "./SearchBarSettings";

export const Appearance = () => {
    const { t } = useTranslation("settingsAppearance");
    const { contextBridge } = useContextBridge();
    const { setTheme } = useContext(ThemeContext);

    const availableThemes = getAvailableThemes();

    const { value: themeName, updateValue: setThemeName } = useSetting<string>({
        key: "appearance.themeName",
        defaultValue: "Fluent UI Web",
    });

    const { value: darkVariants, updateValue: setDarkVariants } = useSetting<BrandVariants>({
        key: "appearance.customDarkThemeVariants",
        defaultValue: darkTheme,
    });

    const { value: lightVariants, updateValue: setLightVariants } = useSetting<BrandVariants>({
        key: "appearance.customLightThemeVariants",
        defaultValue: lightTheme,
    });

    const themes = [
        { value: "Microsoft Teams", label: "Microsoft Teams" },
        { value: "Fluent UI Web", label: "Fluent UI Web" },
        { value: "Custom", label: t("customTheme") },
    ];

    const updateTheme = (themeName: string) => {
        setThemeName(themeName);
        setTheme(getTheme(contextBridge));
    };

    const resetDarkVariants = () => {
        setDarkVariants(darkTheme);
        setTheme(getTheme(contextBridge));
    };

    const updateDarkVariants = (shade: keyof BrandVariants, value: string) => {
        setDarkVariants({ ...darkVariants, ...{ [shade]: value } });
        setTheme(getTheme(contextBridge));
    };

    const resetLightVariants = () => {
        setLightVariants(lightTheme);
        setTheme(getTheme(contextBridge));
    };

    const updateLightVariants = (shade: keyof BrandVariants, value: string) => {
        setLightVariants({ ...lightVariants, ...{ [shade]: value } });
        setTheme(getTheme(contextBridge));
    };

    return (
        <SettingGroupList>
            <SearchBarSettings />
            <SettingGroup title="Colors">
                <Setting
                    label={t("themeName")}
                    control={
                        <Dropdown
                            value={themes.find((t) => t.value === themeName)?.label}
                            onOptionSelect={(_, { optionValue }) => optionValue && updateTheme(optionValue)}
                            selectedOptions={[themeName]}
                        >
                            {availableThemes.map(({ name, accentColors }) => (
                                <Option key={`theme-option-${name}`} value={name} text={name}>
                                    <ThemeOption themeName={name} accentColors={accentColors} />
                                </Option>
                            ))}
                            <Option key="theme-option-custom" value={"Custom"} text={t("customTheme")}>
                                <ThemeOption
                                    themeName={t("customTheme")}
                                    accentColors={{ dark: darkVariants["100"], light: lightVariants["100"] }}
                                />
                            </Option>
                        </Dropdown>
                    }
                />
            </SettingGroup>

            {themeName === "Custom" && (
                <SettingGroup title="Custom colors">
                    <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: 5 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <Tooltip relationship="label" content={t("customThemeDarkShadesHint")} withArrow>
                                    <Body1>{t("customThemeDarkShades")}</Body1>
                                </Tooltip>
                                <Tooltip content={t("customThemeReset")} relationship="label" withArrow>
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                                        onClick={resetDarkVariants}
                                    />
                                </Tooltip>
                            </div>
                            {Object.keys(darkVariants).map((shade: string | keyof BrandVariants) => (
                                <Input
                                    key={`dark-variant-${shade}`}
                                    appearance="filled-darker"
                                    size="small"
                                    style={{ width: "100%" }}
                                    contentBefore={<>{shade}:</>}
                                    contentAfter={
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                backgroundColor: darkVariants[shade as keyof BrandVariants],
                                            }}
                                        ></div>
                                    }
                                    value={darkVariants[shade as keyof BrandVariants]}
                                    onChange={(_, { value }) => updateDarkVariants(shade as keyof BrandVariants, value)}
                                />
                            ))}
                        </div>
                        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: 5 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <Tooltip relationship="label" content={t("customThemeLightShadesHint")} withArrow>
                                    <Body1>{t("customThemeLightShades")}</Body1>
                                </Tooltip>
                                <Tooltip content={t("customThemeReset")} relationship="label" withArrow>
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                                        onClick={resetLightVariants}
                                    />
                                </Tooltip>
                            </div>
                            {Object.keys(lightVariants).map((shade: string | keyof BrandVariants) => (
                                <Input
                                    key={`light-variant-${shade}`}
                                    appearance="filled-darker"
                                    size="small"
                                    style={{ width: "100%" }}
                                    contentBefore={<>{shade}:</>}
                                    contentAfter={
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                backgroundColor: lightVariants[shade as keyof BrandVariants],
                                            }}
                                        ></div>
                                    }
                                    value={lightVariants[shade as keyof BrandVariants]}
                                    onChange={(_, { value }) =>
                                        updateLightVariants(shade as keyof BrandVariants, value)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </SettingGroup>
            )}
        </SettingGroupList>
    );
};
