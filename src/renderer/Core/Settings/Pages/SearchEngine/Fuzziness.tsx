import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Slider } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const Fuzziness = () => {
    const { t } = useTranslation("settingsSearchEngine");

    const { value: fuzziness, updateValue: setFuzziness } = useSetting({
        key: "searchEngine.fuzziness",
        defaultValue: 0.5,
    });

    return (
        <Setting
            label={`${t("fuzziness")}: ${fuzziness}`}
            description="0 = strict search, 1 = loose search"
            control={
                <Slider
                    style={{ width: "70%" }}
                    value={fuzziness}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={(_, { value }) => setFuzziness(value)}
                />
            }
        />
    );
};
