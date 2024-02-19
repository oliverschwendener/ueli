import { useSetting } from "@Core/Hooks";
import { Dropdown, Field, Option } from "@fluentui/react-components";

export const UrlImageGenerator = () => {
    const faviconApiProviders = ["Google", "Favicone"];

    const { value: faviconApiProvider, updateValue: setFaviconApiProvider } = useSetting<string>({
        key: "imageGenerator.faviconApiProvider",
        defaultValue: "Google",
    });

    return (
        <Field label="Favicon API" hint="This API is used to generate icons for URLs">
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
        </Field>
    );
};
