import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Combobox, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ColorConverterSettings = () => {
    const extensionId = "ColorConverter";
    const { t } = useTranslation(`extension[${extensionId}]`);

    const allFormats = ["HEX", "HLS", "RGB"];

    const { value: enabledFormats, updateValue: setEnabledFormats } = useExtensionSetting<string[]>({
        extensionId,
        key: "formats",
    });

    return (
        <SettingGroupList>
            <SettingGroup>
                <Setting
                    control={
                        <Combobox
                            placeholder={t("selectAColorFormat")}
                            value={enabledFormats.join(", ")}
                            multiselect
                            selectedOptions={enabledFormats}
                            onOptionSelect={(_, { selectedOptions }) => setEnabledFormats(selectedOptions)}
                        >
                            {allFormats.map((option) => (
                                <Option key={option}>{option}</Option>
                            ))}
                        </Combobox>
                    }
                    label={t("formats")}
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
