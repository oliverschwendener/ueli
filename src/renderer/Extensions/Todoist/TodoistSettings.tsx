import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { Button, Dropdown, Input, Option, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkRegular, DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const TodoistSettings = () => {
    const extensionId = "Todoist";
    const { t } = useTranslation("extension[Todoist]");

    const { value: quickAddPrefix, updateValue: setQuickAddPrefix } = useExtensionSetting<string>({
        extensionId,
        key: "quickAddPrefix",
    });

    const { value: suggestionLimit, updateValue: setSuggestionLimit } = useExtensionSetting<number>({
        extensionId,
        key: "suggestionLimit",
    });

    const { value: taskListPrefix, updateValue: setTaskListPrefix } = useExtensionSetting<string>({
        extensionId,
        key: "taskListPrefix",
    });

    const { value: taskListLimit, updateValue: setTaskListLimit } = useExtensionSetting<number>({
        extensionId,
        key: "taskListLimit",
    });

    const { value: taskOpenTarget, updateValue: setTaskOpenTarget } = useExtensionSetting<"browser" | "desktopApp">({
        extensionId,
        key: "taskOpenTarget",
    });

    const { value: taskFilter, updateValue: setTaskFilter } = useExtensionSetting<string>({
        extensionId,
        key: "taskFilter",
    });

    const { value: apiToken, updateValue: setApiToken } = useExtensionSetting<string>({
        extensionId,
        key: "apiToken",
        isSensitive: true,
    });

    type LoadingState = "idle" | "loading" | "success" | "error";
    const [refreshState, setRefreshState] = useState<LoadingState>("idle");

    const refreshCaches = async () => {
        setRefreshState("loading");

        try {
            await window.ContextBridge.invokeExtension(extensionId, { type: "refreshCaches" });
            setRefreshState("success");
        } catch (error) {
            setRefreshState("error");
            console.error("Failed to refresh Todoist caches", error);
        } finally {
            setTimeout(() => setRefreshState("idle"), 2000);
        }
    };

    const refreshButtonIcon: Record<LoadingState, JSX.Element | undefined> = {
        loading: <Spinner size="extra-tiny" />,
        success: <CheckmarkRegular color={tokens.colorStatusSuccessForeground1} />,
        error: <DismissRegular color={tokens.colorStatusDangerForeground1} />,
        idle: undefined,
    };

    const selectedTaskOpenTarget = taskOpenTarget ?? "browser";

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName") ?? "Todoist"}>
                <Setting
                    label={t("quickAddPrefix")}
                    control={
                        <Input
                            value={quickAddPrefix}
                            onChange={(_, { value }) => {
                                void setQuickAddPrefix(value);
                            }}
                        />
                    }
                />
                <Setting
                    label={t("taskListPrefix")}
                    control={
                        <Input
                            value={taskListPrefix}
                            onChange={(_, { value }) => {
                                void setTaskListPrefix(value);
                            }}
                        />
                    }
                />
                <Setting
                    label={t("suggestionLimit")}
                    control={
                        <Input
                            value={`${suggestionLimit}`}
                            min={1}
                            type="number"
                            onChange={(_, { value }) => {
                                void setSuggestionLimit(Number(value));
                            }}
                        />
                    }
                />
                <Setting
                    label={t("taskListLimit")}
                    control={
                        <Input
                            value={`${taskListLimit}`}
                            min={1}
                            type="number"
                            onChange={(_, { value }) => {
                                void setTaskListLimit(Number(value));
                            }}
                        />
                    }
                />
                <Setting
                    label={t("taskOpenTarget")}
                    control={
                        <Dropdown
                            selectedOptions={[selectedTaskOpenTarget]}
                            onOptionSelect={(_, data) => {
                                const option = data.optionValue as "browser" | "desktopApp" | undefined;

                                if (option) {
                                    void setTaskOpenTarget(option);
                                }
                            }}
                        >
                            <Option key="browser" value="browser">
                                {t("taskOpenTarget.browser")}
                            </Option>
                            <Option key="desktopApp" value="desktopApp">
                                {t("taskOpenTarget.desktopApp")}
                            </Option>
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("taskFilter")}
                    description={t("taskFilterDescription") ?? undefined}
                    control={
                        <Input
                            value={taskFilter}
                            onChange={(_, { value }) => {
                                void setTaskFilter(value);
                            }}
                        />
                    }
                />
                <Setting
                    label={t("apiToken")}
                    control={
                        <Input
                            value={apiToken}
                            type="password"
                            onChange={(_, { value }) => {
                                void setApiToken(value);
                            }}
                        />
                    }
                />
                <Setting
                    label={t("refreshCaches")}
                    description={t("refreshCachesDescription")}
                    control={
                        <Button iconPosition="after" icon={refreshButtonIcon[refreshState]} onClick={refreshCaches}>
                            {t(`refreshCachesButton.${refreshState}` as const)}
                        </Button>
                    }
                />
            </SettingGroup>
        </SettingGroupList>
    );
};
