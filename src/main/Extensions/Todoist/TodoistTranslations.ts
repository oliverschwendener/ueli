import type { Resources, Translations } from "@common/Core/Translator";

export const todoistTranslationNamespace = "extension[Todoist]";

export const getTodoistI18nResources = (): Resources<Translations> => ({
    "en-US": {
        extensionName: "Todoist",
        prefix: "Prefix",
        suggestionLimit: "Suggestion limit",
        apiToken: "API token",
        quickAddDescription: "Add to Todoist",
        applySuggestionDescription: "Insert suggestion",
        notificationTitle: "Todoist",
        missingTokenNotificationBody: "Please configure your API token.",
        quickAddSuccessNotificationBody: "Task added.",
        quickAddFailureNotificationBody: "Failed to add task.",
        labelSuggestionDescription: "Label suggestions",
        projectSuggestionDescription: "Project suggestions",
        prioritySuggestionDescription: "Priority suggestions",
        priorityDisplayName: "Priority {{priority}}",
    },
    "ja-JP": {
        extensionName: "Todoist",
        prefix: "接頭辞",
        suggestionLimit: "サジェスト件数上限",
        apiToken: "API トークン",
        quickAddDescription: "Todoist に追加",
        applySuggestionDescription: "候補を挿入",
        notificationTitle: "Todoist",
        missingTokenNotificationBody: "API トークンを設定してください",
        quickAddSuccessNotificationBody: "追加しました",
        quickAddFailureNotificationBody: "追加に失敗しました",
        labelSuggestionDescription: "ラベル候補",
        projectSuggestionDescription: "プロジェクト候補",
        prioritySuggestionDescription: "優先度候補",
        priorityDisplayName: "優先度 {{priority}}",
    },
});
