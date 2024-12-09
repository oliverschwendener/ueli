import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";

type CustomWebBrowserNameProps = {
    useDefaultWebBrowser: boolean;
};

export const CustomWebBrowserName = ({ useDefaultWebBrowser }: CustomWebBrowserNameProps) => {
    const { value, updateValue } = useSetting({ key: "general.browser.customWebBrowserName", defaultValue: "" });

    return (
        <Setting
            label="Browser Name"
            description={`For example "Google Chrome" or "Firefox"`}
            control={
                <Input value={value} onChange={(_, { value }) => updateValue(value)} disabled={useDefaultWebBrowser} />
            }
        />
    );
};
