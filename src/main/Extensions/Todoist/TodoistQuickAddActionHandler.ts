import type { ActionHandler } from "@Core/ActionHandler";
import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { SearchResultItemAction } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { NotificationPresenter } from "./TodoistNotificationPresenter";
import type { TodoistApiFactory } from "./TodoistApiFactory";
import { getTodoistI18nResources, todoistTranslationNamespace } from "./TodoistTranslations";

const QuickAddHandlerId = "TodoistQuickAdd";

export class TodoistQuickAddActionHandler implements ActionHandler {
    public readonly id = QuickAddHandlerId;

    public constructor(
        private readonly todoistApiFactory: TodoistApiFactory,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly notificationPresenter: NotificationPresenter,
        private readonly browserWindowRegistry: BrowserWindowRegistry,
        private readonly logger: Logger,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { t } = this.translator.createT(getTodoistI18nResources());

        try {
            const { text } = this.parseArgument(action.argument);
            const apiToken = this.getApiToken();

            if (!apiToken) {
                this.notificationPresenter.show({
                    title: t("notificationTitle", { ns: todoistTranslationNamespace }),
                    body: t("missingTokenNotificationBody", { ns: todoistTranslationNamespace }),
                });
                this.hideSearchWindow();
                return;
            }

            try {
                const todoistApi = this.todoistApiFactory.create(apiToken);
                await todoistApi.quickAddTask({ text });

                this.notificationPresenter.show({
                    title: t("notificationTitle", { ns: todoistTranslationNamespace }),
                    body: t("quickAddSuccessNotificationBody", { ns: todoistTranslationNamespace }),
                });
                this.hideSearchWindow();
                return;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.logger.error(`Todoist quick add failed. Reason: ${message}`);

                this.notificationPresenter.show({
                    title: t("notificationTitle", { ns: todoistTranslationNamespace }),
                    body: t("quickAddFailureNotificationBody", { ns: todoistTranslationNamespace }),
                });
                this.hideSearchWindow();
            }
        } catch (error) {
            this.logger.error(`Todoist quick add failed. Reason: ${error instanceof Error ? error.message : error}`);
            this.notificationPresenter.show({
                title: t("notificationTitle", { ns: todoistTranslationNamespace }),
                body: t("quickAddFailureNotificationBody", { ns: todoistTranslationNamespace }),
            });
            this.hideSearchWindow();
        }
    }

    private parseArgument(argument: string): { text: string } {
        const parsed = JSON.parse(argument) as { text?: unknown };

        if (!parsed || typeof parsed.text !== "string" || parsed.text.trim().length === 0) {
            throw new Error("Todoist quick add action requires a non-empty text argument.");
        }

        return { text: parsed.text };
    }

    private getApiToken(): string {
        return this.settingsManager.getValue<string>(getExtensionSettingKey("Todoist", "apiToken"), "", true);
    }

    private hideSearchWindow(): void {
        const searchWindow = this.browserWindowRegistry.getById("search");

        if (searchWindow && !searchWindow.isDestroyed()) {
            searchWindow.hide();
        }
    }
}

export { QuickAddHandlerId };
