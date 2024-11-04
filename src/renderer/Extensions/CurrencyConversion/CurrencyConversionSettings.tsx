import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { availableCurrencies } from "./availableCurrencies";

export const CurrencyConversionSettings = () => {
    const { t } = useTranslation("extension[CurrencyConversion]");

    const { value: currencies, updateValue: setCurrencies } = useExtensionSetting<string[]>({
        extensionId: "CurrencyConversion",
        key: "currencies",
    });

    const { value: defaultTargetCurrency, updateValue: setDefaultTargetCurrency } = useExtensionSetting<string>({
        extensionId: "CurrencyConversion",
        key: "defaultTargetCurrency",
    });

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("currencies")}
                    control={
                        <Dropdown
                            selectedOptions={currencies}
                            value={currencies.map((c) => c.toUpperCase()).join(", ")}
                            placeholder={t("selectCurrencies")}
                            multiselect
                            onOptionSelect={(_, { selectedOptions }) => setCurrencies(selectedOptions)}
                        >
                            {Object.keys(availableCurrencies).map((availableCurrency) => (
                                <Option key={availableCurrency} value={availableCurrency}>
                                    {`${availableCurrency.toUpperCase()} (${availableCurrencies[availableCurrency]})`}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("defaultTargetCurrency")}
                    control={
                        <Dropdown
                            selectedOptions={[defaultTargetCurrency]}
                            value={defaultTargetCurrency.toUpperCase()}
                            placeholder={t("selectDefaultTargetCurrency")}
                            onOptionSelect={(_, { optionValue }) =>
                                optionValue && setDefaultTargetCurrency(optionValue)
                            }
                        >
                            {currencies.map((currency) => (
                                <Option key={currency} value={currency}>
                                    {`${currency.toUpperCase()}`}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
