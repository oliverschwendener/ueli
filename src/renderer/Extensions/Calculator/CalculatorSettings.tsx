import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Field, Input, SpinButton } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const CalculatorSettings = () => {
    const extensionId = "Calculator";

    const { t } = useTranslation();
    const ns = "extension[Calculator]";

    const { value: precision, updateValue: setPrecision } = useExtensionSetting<number>({
        extensionId,
        key: "precision",
    });

    const { value: decimalSeparator, updateValue: setDecimalSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "decimalSeparator",
    });

    const { value: argumentSeparator, updateValue: setArgumentSeparator } = useExtensionSetting<string>({
        extensionId,
        key: "argumentSeparator",
    });

    return (
        <SectionList>
            <Section>
                <Field label={t("precision", { ns })}>
                    <SpinButton
                        value={precision}
                        onChange={(_, { value }) => value && setPrecision(value)}
                        min={1}
                        max={32}
                        step={1}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("decimalSeparator", { ns })}>
                    <Input value={decimalSeparator} onChange={(_, { value }) => setDecimalSeparator(value)} />
                </Field>
            </Section>
            <Section>
                <Field label={t("argumentSeparator", { ns })}>
                    <Input value={argumentSeparator} onChange={(_, { value }) => setArgumentSeparator(value)} />
                </Field>
            </Section>
        </SectionList>
    );
};
