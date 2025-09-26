import type { SearchResultItemAction } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { TaskOpenTarget } from "@common/Extensions/Todoist";
import type { ActionHandler } from "@Core/ActionHandler";
import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { Shell } from "electron";
import { getTodoistI18nResources } from "./TodoistTranslations";

const OpenExternalTimeoutInMs = 3000;

export const TodoistOpenTaskHandlerId = "TodoistOpenTask";

export class TodoistOpenTaskActionHandler implements ActionHandler {
    public readonly id = TodoistOpenTaskHandlerId;

    public constructor(
        private readonly shell: Shell,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly browserWindowRegistry: BrowserWindowRegistry,
        private readonly logger: Logger,
        private readonly reportTaskOpenIssue: (issue: { searchTerm: string; message: string }) => void,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { taskId, webUrl, desktopUrl, searchTerm } = this.parseArgument(action.argument);
        const { t } = this.translator.createT(getTodoistI18nResources());

        const target = this.getTaskOpenTarget();

        try {
            switch (target) {
                case "browser": {
                    await this.openExternalWithTimeout(webUrl);
                    this.hideSearchWindow();
                    return;
                }
                case "desktopApp": {
                    try {
                        await this.openExternalWithTimeout(desktopUrl);
                        this.hideSearchWindow();
                    } catch (desktopError) {
                        const desktopMessage =
                            desktopError instanceof Error ? desktopError.message : String(desktopError);
                        this.logger.warn(
                            `Opening Todoist desktop task failed for ${taskId}. Reason: ${desktopMessage}`,
                        );

                        try {
                            await this.openExternalWithTimeout(webUrl);
                            this.reportTaskOpenIssue({
                                searchTerm,
                                message: t("desktopOpenFailedFallback"),
                            });
                        } catch (browserError) {
                            const browserMessage =
                                browserError instanceof Error ? browserError.message : String(browserError);
                            this.logger.error(
                                `Fallback to browser for Todoist task ${taskId} failed. Reason: ${browserMessage}`,
                            );
                            this.reportTaskOpenIssue({
                                searchTerm,
                                message: t("desktopOpenFailed"),
                            });
                        }
                    }

                    return;
                }
                default: {
                    const exhaustiveCheck: never = target;
                    throw new Error(`Unsupported Todoist task open target: ${exhaustiveCheck}`);
                }
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Todoist open task handler failed. Reason: ${message}`);
        }
    }

    private parseArgument(argument: string): {
        taskId: string;
        webUrl: string;
        desktopUrl: string;
        searchTerm: string;
    } {
        const parsed = JSON.parse(argument) as {
            taskId?: unknown;
            webUrl?: unknown;
            desktopUrl?: unknown;
            searchTerm?: unknown;
        };

        if (!parsed) {
            throw new Error("Todoist open task action requires an argument.");
        }

        if (typeof parsed.taskId !== "string" || parsed.taskId.trim().length === 0) {
            throw new Error("Todoist open task action requires a taskId string argument.");
        }

        if (typeof parsed.webUrl !== "string" || parsed.webUrl.trim().length === 0) {
            throw new Error("Todoist open task action requires a webUrl string argument.");
        }

        if (typeof parsed.desktopUrl !== "string" || parsed.desktopUrl.trim().length === 0) {
            throw new Error("Todoist open task action requires a desktopUrl string argument.");
        }

        if (typeof parsed.searchTerm !== "string") {
            throw new Error("Todoist open task action requires a searchTerm string argument.");
        }

        return {
            taskId: parsed.taskId,
            webUrl: parsed.webUrl,
            desktopUrl: parsed.desktopUrl,
            searchTerm: parsed.searchTerm,
        };
    }

    private getTaskOpenTarget(): TaskOpenTarget {
        const value = this.settingsManager.getValue<TaskOpenTarget>(
            getExtensionSettingKey("Todoist", "taskOpenTarget"),
            "browser",
        );

        return value === "desktopApp" ? "desktopApp" : "browser";
    }

    private async openExternalWithTimeout(url: string): Promise<void> {
        let timeoutId: NodeJS.Timeout | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error("openExternal timed out"));
            }, OpenExternalTimeoutInMs);
        });

        try {
            await Promise.race([this.shell.openExternal(url), timeoutPromise]);
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }

    private hideSearchWindow(): void {
        const searchWindow = this.browserWindowRegistry.getById("search");

        if (searchWindow && !searchWindow.isDestroyed()) {
            searchWindow.hide();
        }
    }
}
