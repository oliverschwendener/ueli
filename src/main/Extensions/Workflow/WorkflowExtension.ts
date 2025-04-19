import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { Workflow } from "@common/Extensions/Workflow";
import type { Settings } from "./Settings";
import { WorkflowActionArgumentEncoder } from "./Utility";
import type { WorkflowRepository } from "./WorkflowRepository";

export class WorkflowExtension implements Extension {
    public readonly id = "Workflow";

    public readonly name = "Workflow";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[Workflow]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings: Settings = {
        workflows: <Workflow[]>[],
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly workflowRepository: WorkflowRepository,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const workflows = await this.workflowRepository.getAll();

        const { t } = this.translator.createT(this.getI18nResources());

        const workflowToSearchResultItem = (workflow: Workflow): SearchResultItem => {
            return {
                defaultAction: {
                    argument: WorkflowActionArgumentEncoder.encodeArgument(workflow.actions),
                    description: t("searchResultItemActionDescription"),
                    handlerId: "Workflow",
                    fluentIcon: "OpenRegular",
                    hideWindowAfterInvocation: true,
                },
                description: t("searchResultItemDescription"),
                details: workflow.actions.map((action) => action.name).join(", "),
                id: workflow.id,
                image: this.getImage(),
                name: workflow.name,
            };
        };

        return workflows.map((workflow) => workflowToSearchResultItem(workflow));
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "workflow.png")}`,
        };
    }

    public getI18nResources(): Resources<Translations> {
        return {
            "en-US": {
                extensionName: "Workflows",
                searchResultItemDescription: "Workflow",
                searchResultItemActionDescription: "Invoke workflow",

                // Settings
                addWorkflow: "Add workflow",
                editWorkflow: "Edit workflow",
                deleteWorkflow: "Delete workflow",
                newWorkflow: "New Workflow",
                workflows: "Workflows",
                actions: "Actions",
                workflowName: "Workflow name",
                workflowNamePlaceholder: "Add a name for the workflow",
                cancel: "Cancel",
                save: "Save",
                type: "Type",
                selectFile: "Select file",
                selectFolder: "Select folder",
                "type.OpenFile": "Open file",
                "type.OpenUrl": "Open URL",
                "type.OpenTerminal": "Open terminal",
                "type.ExecuteCommand": "Execute command",
                newAction: "New Action",
                actionName: "Action name",
                actionNamePlaceholder: "Add a name for the action",
                addAction: "Add Action",
                "argType.OpenFile": "File path",
                "argType.OpenUrl": "URL",
                "argType.OpenTerminal.command": "Command",
                "argType.ExecuteCommand": "Command",
                "argType.OpenFile.placeholder": "Add a file path",
                "argType.OpenTerminal.terminal.placeholder": "Select a terminal",
                "argType.OpenTerminal.command.placeholder": "Add a command",
                "argType.OpenUrl.placeholder": "Add a URL",
                "argType.ExecuteCommand.placeholder": "Add a command",
                removeAction: "Remove Action",
                removeWorkflowConfirmationTitle: `You are about to delete "{{workflowName}}"`,
                removeWorkflowConfirmationContent: "Are you sure?",
                yes: "Yes",
                no: "No",
            },
            "de-CH": {
                extensionName: "Arbeitsabläufe",
                searchResultItemDescription: "Arbeitsablauf",
                searchResultItemActionDescription: "Arbeitsablauf ausführen",

                // Settings
                addWorkflow: "Arbeitsablauf hinzufügen",
                editWorkflow: "Arbeitsablauf bearbeiten",
                deleteWorkflow: "Arbeitsablauf löschen",
                newWorkflow: "Neuer Arbeitsablauf",
                workflows: "Arbeitsabläufe",
                actions: "Aktionen",
                workflowName: "Name des Arbeitsablaufs",
                workflowNamePlaceholder: "Füge einen Namen für den Arbeitsablauf hinzu",
                cancel: "Abbrechen",
                save: "Speichern",
                type: "Typ",
                selectFile: "Datei auswählen",
                selectFolder: "Ordner auswählen",
                "type.OpenFile": "Datei öffnen",
                "type.OpenUrl": "URL öffnen",
                "type.OpenTerminal": "Terminal öffnen",
                "type.ExecuteCommand": "Befehl ausführen",
                newAction: "Neue Aktion",
                actionName: "Name der Aktion",
                actionNamePlaceholder: "Füge einen Namen für die Aktion hinzu",
                addAction: "Aktion hinzufügen",
                "argType.OpenFile": "Dateipfad",
                "argType.OpenUrl": "URL",
                "argType.OpenTerminal.command": "Befehl",
                "argType.ExecuteCommand": "Befehl",
                "argType.OpenFile.placeholder": "Füge einen Dateipfad hinzu",
                "argType.OpenTerminal.terminal.placeholder": "Wähle ein Terminal aus",
                "argType.OpenTerminal.command.placeholder": "Füge einen Befehl hinzu",
                "argType.OpenUrl.placeholder": "Füge eine URL hinzu",
                "argType.ExecuteCommand.placeholder": "Füge einen Befehl hinzu",
                removeAction: "Aktion entfernen",
                removeWorkflowConfirmationTitle: `Du bist gerade dabei den Arbeitsablauf "{{workflowName}}" zu löschen.`,
                removeWorkflowConfirmationContent: "Bist du dir sicher?",
                yes: "Ja",
                no: "Nein",
            },
            "ja-JP": {
                extensionName: "ワークフロー",
                searchResultItemDescription: "ワークフロー",
                searchResultItemActionDescription: "ワークフローを呼び出す",

                // Settings
                addWorkflow: "ワークフローを追加",
                editWorkflow: "編集",
                deleteWorkflow: "削除",
                newWorkflow: "新規ワークフロー",
                workflows: "ワークフロー",
                actions: "アクション",
                workflowName: "名前",
                workflowNamePlaceholder: "ワークフローに名前を付ける",
                cancel: "キャンセル",
                save: "保存",
                type: "タイプ",
                selectFile: "ファイルを選択",
                selectFolder: "フォルダを選択",
                "type.OpenFile": "ファイルを開く",
                "type.OpenUrl": "URLを開く",
                "type.OpenTerminal": "ターミナルを開く",
                "type.ExecuteCommand": "コマンドを実行",
                newAction: "新規アクション",
                actionName: "アクション名",
                actionNamePlaceholder: "アクションに名前を付ける",
                addAction: "アクションを追加",
                "argType.OpenFile": "ファイルパス",
                "argType.OpenUrl": "URL",
                "argType.OpenTerminal.command": "ターミナルで実行するコマンド",
                "argType.ExecuteCommand": "実行コマンド",
                "argType.OpenFile.placeholder": "ファイルパスを追加",
                "argType.OpenTerminal.terminal.placeholder": "ターミナルを選択",
                "argType.OpenTerminal.command.placeholder": "ターミナルで実行するコマンドを追加",
                "argType.OpenUrl.placeholder": "URLを追加",
                "argType.ExecuteCommand.placeholder": "コマンドを追加",
                removeAction: "アクションを削除",
                removeWorkflowConfirmationTitle: `"{{workflowName}}を削除してもよいですか"`,
                removeWorkflowConfirmationContent: "本当に削除してもよいですか？",
                yes: "はい、削除してください",
                no: "いいえ、やめてください",
            },
            "ko-KR": {
                extensionName: "워크플로우",
                searchResultItemDescription: "워크플로우",
                searchResultItemActionDescription: "워크플로우 실행",

                // Settings
                addWorkflow: "워크플로우 추가",
                editWorkflow: "편집",
                deleteWorkflow: "삭제",
                newWorkflow: "새 워크플로우",
                workflows: "워크플로우",
                actions: "작업",
                workflowName: "이름",
                workflowNamePlaceholder: "워크플로우 이름 추가",
                cancel: "취소",
                save: "저장",
                type: "유형",
                selectFile: "파일 선택",
                selectFolder: "폴더 선택",
                "type.OpenFile": "파일 열기",
                "type.OpenUrl": "URL 열기",
                "type.OpenTerminal": "터미널 열기",
                "type.ExecuteCommand": "명령어 실행",
                newAction: "새 작업",
                actionName: "작업 이름",
                actionNamePlaceholder: "작업 이름 추가",
                addAction: "작업 추가",
                "argType.OpenFile": "파일 경로",
                "argType.OpenUrl": "URL",
                "argType.OpenTerminal.command": "실행할 명령어",
                "argType.ExecuteCommand": "실행할 명령어",
                "argType.OpenFile.placeholder": "파일 경로 추가",
                "argType.OpenTerminal.terminal.placeholder": "터미널 선택",
                "argType.OpenTerminal.command.placeholder": "실행할 명령어 추가",
                "argType.OpenUrl.placeholder": "URL 추가",
                "argType.ExecuteCommand.placeholder": "명령어 추가",
                removeAction: "작업 제거",
                removeWorkflowConfirmationTitle: `{{workflowName}}를 삭제하시겠습니까?`,
                removeWorkflowConfirmationContent: "정말 삭제하시겠습니까?",
                yes: "확인",
                no: "취소",
            },
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "workflows")];
    }
}
