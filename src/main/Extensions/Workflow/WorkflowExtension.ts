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
                },
                description: t("searchResultItemDescription"),
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
            },
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "workflows")];
    }
}
