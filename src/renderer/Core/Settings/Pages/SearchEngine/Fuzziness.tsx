import { useSetting } from "@Core/Hooks";
import { Field, Slider } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const Fuzziness = () => {
    const ns = "settingsSearchEngine";
    const { t } = useTranslation();

    const { value: fuzziness, updateValue: setFuzziness } = useSetting({
        key: "searchEngine.fuzziness",
        defaultValue: 0.5,
    });

    return (
        <Field label={`${t("fuzziness", { ns })}: ${fuzziness}`} hint="0 = strict search, 1 = loose search">
            <Slider value={fuzziness} min={0} max={1} step={0.1} onChange={(_, { value }) => setFuzziness(value)} />
        </Field>
    );
};
