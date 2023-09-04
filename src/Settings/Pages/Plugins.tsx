import { Checkbox } from "@fluentui/react-components";
import { useContextBridge, useSetting } from "../../Hooks";
import { SectionList } from "../SectionList";

export const Plugins = () => {
    const { getAllPlugins, pluginDisabled: disablePlugin, pluginEnabled: enablePlugin } = useContextBridge();

    const { value: enabledPluginIds, updateValue: setEnabledPluginIds } = useSetting("plugins.enabledPluginIds", [
        "ApplicationSearch",
    ]);

    const enable = (pluginId: string) => {
        setEnabledPluginIds([pluginId, ...enabledPluginIds]);
        enablePlugin(pluginId);
    };

    const disable = (pluginId: string) => {
        setEnabledPluginIds(enabledPluginIds.filter((p) => p !== pluginId));
        disablePlugin(pluginId);
    };

    return (
        <SectionList>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {getAllPlugins().map(({ id, name }) => (
                    <Checkbox
                        key={id}
                        checked={enabledPluginIds.includes(id)}
                        onChange={(_, { checked }) => (checked ? enable(id) : disable(id))}
                        label={name}
                    />
                ))}
            </div>
        </SectionList>
    );
};
