import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const UrlImageGenerator = () => {
    const { t } = useTranslation("settingsGeneral");

    const faviconApiProviders = ["Google", "Favicone", "DuckDuckGo"];

    const { value: faviconApiProvider, updateValue: setFaviconApiProvider } = useSetting<string>({
        key: "imageGenerator.faviconApiProvider",
        defaultValue: "Google",
    });

    return (
        <Setting
            label={t("faviconApi")}
            description={t("faviconApiDescription")}
            control={
                <Dropdown
                    value={faviconApiProvider}
                    selectedOptions={[faviconApiProvider]}
                    onOptionSelect={(_, { optionValue }) => optionValue && setFaviconApiProvider(optionValue)}
                >
                    {faviconApiProviders.map((f) => (
                        <Option key={`faviconApi-${f}`} value={f} text={f}>
                            {f}
                        </Option>
                    ))}
                </Dropdown>
            }
        />
    );
};
