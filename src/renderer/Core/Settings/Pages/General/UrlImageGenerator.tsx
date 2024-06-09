import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Dropdown, Option } from "@fluentui/react-components";

export const UrlImageGenerator = () => {
    const faviconApiProviders = ["Google", "Favicone"];

    const { value: faviconApiProvider, updateValue: setFaviconApiProvider } = useSetting<string>({
        key: "imageGenerator.faviconApiProvider",
        defaultValue: "Google",
    });

    return (
        <Setting
            label="Favicon API"
            description="This API is used to generate icons for URLs"
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
