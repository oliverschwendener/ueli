import { Checkbox } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { SectionList } from "../SectionList";

export const Plugins = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const { getAllPlugins, pluginDisabled: disablePlugin, pluginEnabled: enablePlugin } = contextBridge;

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
                {getAllPlugins().map(({ id, name, nameTranslationKey }) => (
                    <Checkbox
                        key={id}
                        checked={enabledPluginIds.includes(id)}
                        onChange={(_, { checked }) => (checked ? enable(id) : disable(id))}
                        label={nameTranslationKey ? t(nameTranslationKey) : name}
                    />
                ))}
            </div>
        </SectionList>
    );
};
