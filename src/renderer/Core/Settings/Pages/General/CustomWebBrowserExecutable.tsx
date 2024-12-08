import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";
import { useState } from "react";

type CustomWebBrowserProps = {
    useDefaultWebBrowser: boolean;
};

export const CustomWebBrowserExecutable = ({ useDefaultWebBrowser }: CustomWebBrowserProps) => {
    const { value, updateValue } = useSetting({
        defaultValue: "",
        key: "general.browser.customWebBrowserTemplate",
    });

    const [temp, setTemp] = useState(value);

    return (
        <Setting
            label="Custom web browser executable"
            control={
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Input
                        disabled={useDefaultWebBrowser}
                        value={temp}
                        onChange={(_, { value }) => value && setTemp(value)}
                        onBlur={() => updateValue(temp)}
                    />
                </div>
            }
        />
    );
};
