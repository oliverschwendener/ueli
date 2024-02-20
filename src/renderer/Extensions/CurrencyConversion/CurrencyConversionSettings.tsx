import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { availableCurrencies } from "./availableCurrencies";

export const CurrencyConversionSettings = () => {
    const { t } = useTranslation();
    const ns = "extension[CurrencyConversion]";

    const { value: currencies, updateValue: setCurrencies } = useExtensionSetting<string[]>({
        extensionId: "CurrencyConversion",
        key: "currencies",
    });

    return (
        <SectionList>
            <Section>
                <Field label={t("currencies", { ns })}>
                    <Dropdown
                        selectedOptions={currencies}
                        value={currencies.map((c) => c.toUpperCase()).join(", ")}
                        placeholder={t("selectCurrencies", { ns })}
                        multiselect
                        onOptionSelect={(_, { selectedOptions }) => setCurrencies(selectedOptions)}
                    >
                        {Object.keys(availableCurrencies).map((availableCurrency) => (
                            <Option key={availableCurrency} value={availableCurrency}>
                                {`${availableCurrency.toUpperCase()} (${availableCurrencies[availableCurrency]})`}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
            </Section>
        </SectionList>
    );
};
