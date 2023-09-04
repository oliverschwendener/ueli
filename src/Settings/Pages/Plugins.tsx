import { Checkbox } from "@fluentui/react-components";
import { useContextBridge, useSetting } from "../../Hooks";
import { SectionList } from "../SectionList";

export const Plugins = () => {
    const { getAllPlugins } = useContextBridge();

    const { value: enabledPluginIds, updateValue: setEnabledPluginIds } = useSetting("plugins.enabledPluginIds", [
        "ApplicationSearch",
    ]);

    const enablePlugin = (pluginId: string) => setEnabledPluginIds([pluginId, ...enabledPluginIds]);
    const disablePlugin = (pluginId: string) => setEnabledPluginIds(enabledPluginIds.filter((p) => p !== pluginId));

    return (
        <SectionList>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {getAllPlugins().map(({ id, name }) => (
                    <Checkbox
                        key={id}
                        checked={enabledPluginIds.includes(id)}
                        onChange={(_, { checked }) => (checked ? enablePlugin(id) : disablePlugin(id))}
                        label={name}
                    />
                ))}
            </div>
        </SectionList>
    );
};
