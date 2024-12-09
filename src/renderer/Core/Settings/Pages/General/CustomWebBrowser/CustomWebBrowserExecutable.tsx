import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { FolderRegular } from "@fluentui/react-icons";

type CustomWebBrowserProps = {
    useDefaultWebBrowser: boolean;
};

export const CustomWebBrowserExecutable = ({ useDefaultWebBrowser }: CustomWebBrowserProps) => {
    const { value, updateValue } = useSetting({
        defaultValue: "",
        key: "general.browser.customWebBrowserExecutable",
    });

    const chooseFile = async () => {
        const { canceled, filePaths } = await window.ContextBridge.showOpenDialog({ properties: ["openFile"] });
        if (!canceled && filePaths.length) {
            updateValue(filePaths[0]);
        }
    };

    return (
        <Setting
            label="Custom web browser executable"
            control={
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Input
                        disabled={useDefaultWebBrowser}
                        value={value}
                        onChange={(_, { value }) => updateValue(value)}
                        contentAfter={
                            <Tooltip content="Select file" relationship="label">
                                <Button
                                    size="small"
                                    appearance="subtle"
                                    icon={<FolderRegular />}
                                    onClick={chooseFile}
                                />
                            </Tooltip>
                        }
                    />
                </div>
            }
        />
    );
};
