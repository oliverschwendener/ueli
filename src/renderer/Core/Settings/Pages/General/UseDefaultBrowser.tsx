import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";

type UseDefaultBrowserProps = {
    useDefaultWebBrowser: boolean;
    setUseDefaultBrowser: (value: boolean) => void;
};

export const UseDefaultBrowser = ({ useDefaultWebBrowser, setUseDefaultBrowser }: UseDefaultBrowserProps) => {
    return (
        <Setting
            label="Open URLs with default browser"
            control={
                <Switch checked={useDefaultWebBrowser} onChange={(_, { checked }) => setUseDefaultBrowser(checked)} />
            }
        />
    );
};
