import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Combobox, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const ColorConverterSettings = () => {
    const { t } = useTranslation("extension[ColorConverter]");

    const allOptions = ["HEX", "HLS", "RGB"];

    const { value: enabledColorSystems, updateValue: setEnabledColorSystems } = useExtensionSetting<string[]>({
        extensionId: "ColorConverter",
        key: "colorSystems",
    });

    return (
        <SettingGroupList>
            <SettingGroup>
                <Setting
                    control={
                        <Combobox
                            placeholder={t("selectAColorSystem")}
                            value={enabledColorSystems.join(", ")}
                            multiselect
                            selectedOptions={enabledColorSystems}
                            onOptionSelect={(_, { selectedOptions }) => setEnabledColorSystems(selectedOptions)}
                        >
                            {allOptions.map((option) => (
                                <Option key={option}>{option}</Option>
                            ))}
                        </Combobox>
                    }
                    label={t("colorSystem")}
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
