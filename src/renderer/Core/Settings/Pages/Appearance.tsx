import { darkTheme, lightTheme } from "@Core/Theme/defaultValues";
import { BrandVariants, Button, Dropdown, Field, Input, Option, Tooltip } from "@fluentui/react-components";
import { ArrowCounterclockwiseRegular } from "@fluentui/react-icons";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { getAvailableThemes, getTheme } from "../../Theme";
import { ThemeContext } from "../../ThemeContext";
import { Section } from "../Section";
import { SectionList } from "../SectionList";
import { ThemeOption } from "./ThemeOption";

export const Appearance = () => {
    const { t } = useTranslation();
    const ns = "settingsAppearance";
    const { contextBridge } = useContextBridge();
    const { setTheme } = useContext(ThemeContext);

    const availableThemes = getAvailableThemes();

    const updateTheme = () => setTheme(getTheme(contextBridge));

    const { value: themeName, updateValue: setThemeName } = useSetting<string>(
        "appearance.themeName",
        "Fluent UI Web",
        false,
        updateTheme,
    );

    const { value: darkVariants, updateValue: setDarkVariants } = useSetting<BrandVariants>(
        "appearance.customDarkThemeVariants",
        darkTheme,
        false,
        updateTheme,
    );

    const { value: lightVariants, updateValue: setLightVariants } = useSetting<BrandVariants>(
        "appearance.customLightThemeVariants",
        lightTheme,
        false,
        updateTheme,
    );

    const themes = [
        { value: "Microsoft Teams", label: "Microsoft Teams" },
        { value: "Fluent UI Web", label: "Fluent UI Web" },
        { value: "Custom", label: t("customTheme", { ns }) },
    ];

    return (
        <SectionList>
            <Section>
                <Field label={t("themeName", { ns })}>
                    <Dropdown
                        value={themes.find((t) => t.value === themeName)?.label}
                        onOptionSelect={(_, { optionValue }) => optionValue && setThemeName(optionValue)}
                        selectedOptions={[themeName]}
                    >
                        {availableThemes.map(({ name, accentColors }) => (
                            <Option key={`theme-option-${name}`} value={name} text={name}>
                                <ThemeOption themeName={name} accentColors={accentColors} />
                            </Option>
                        ))}
                        <Option key="theme-option-custom" value={"Custom"} text={t("customTheme", { ns })}>
                            <ThemeOption
                                themeName={t("customTheme", { ns })}
                                accentColors={{ dark: darkVariants["100"], light: lightVariants["100"] }}
                            />
                        </Option>
                    </Dropdown>
                </Field>
            </Section>
            {themeName === "Custom" ? (
                <Section>
                    <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: 5 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                {t("customThemeDarkShades", { ns })}{" "}
                                <Tooltip content={t("customThemeReset", { ns })} relationship="label">
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                                        onClick={() => setDarkVariants(darkTheme)}
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
                                    onChange={(_, { value }) =>
                                        setDarkVariants({ ...darkVariants, ...{ [shade]: value } })
                                    }
                                />
                            ))}
                        </div>
                        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: 5 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                {t("customThemeLightShades", { ns })}{" "}
                                <Tooltip content={t("customThemeReset", { ns })} relationship="label">
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                                        onClick={() => setLightVariants(lightTheme)}
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
                                        setLightVariants({ ...lightVariants, ...{ [shade]: value } })
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </Section>
            ) : null}
        </SectionList>
    );
};
