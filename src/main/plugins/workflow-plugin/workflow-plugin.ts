import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SearchPlugin } from "../../search-plugin";
import { WorkflowOptions } from "../../../common/config/workflow-options";
import { IconType } from "../../../common/icon/icon-type";
import { WorkflowExecutionArgument } from "./workflow-execution-argument";
import { WorkflowExecutionArgumentType } from "./workflow-execution-argument-type";
import { Workflow } from "./workflow";
import { Icon } from "../../../common/icon/icon";

export class WorkflowPlugin implements SearchPlugin {
    public pluginType = PluginType.Workflow;
    public openLocationSupported = false;
    public autoCompletionSupported = false;
    private config: WorkflowOptions;
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly commandlineExecutor: (command: string) => Promise<void>;
    private readonly defaultWorkflowIcon: Icon = {
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M 6 3 C 4.3549904 3 3 4.3549904 3 6 C 3 7.2931586 3.84267 8.3951413 5 8.8125 L 5 13 L 7 13 L 7 8.8125 C 8.15733 8.3951413 9 7.2931586 9 6 C 9 4.3549904 7.6450096 3 6 3 z M 18 3 A 3 3 0 0 0 15.175781 5 L 11 5 L 11 7 L 15.173828 7 A 3 3 0 0 0 18 9 A 3 3 0 0 0 21 6 A 3 3 0 0 0 18 3 z M 6 5 C 6.5641294 5 7 5.4358706 7 6 C 7 6.5641294 6.5641294 7 6 7 C 5.4358706 7 5 6.5641294 5 6 C 5 5.4358706 5.4358706 5 6 5 z M 17 11 L 17 15 L 14.707031 17.292969 C 14.317031 17.682969 14.317031 18.317031 14.707031 18.707031 L 17.292969 21.292969 C 17.682969 21.683969 18.316031 21.683969 18.707031 21.292969 L 21.292969 18.707031 C 21.683969 18.317031 21.683969 17.683969 21.292969 17.292969 L 19 15 L 19 11 L 17 11 z M 4 15 C 3.448 15 3 15.448 3 16 L 3 20 C 3 20.552 3.448 21 4 21 L 8 21 C 8.552 21 9 20.552 9 20 L 9 16 C 9 15.448 8.552 15 8 15 L 4 15 z"></path>
    </svg>`,
        type: IconType.SVG,
    };

    constructor(
        config: WorkflowOptions,
        filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>,
        urlExecutor: (url: string) => Promise<void>,
        commandlineExecutor: (command: string) => Promise<void>,
    ) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
        this.urlExecutor = urlExecutor;
        this.commandlineExecutor = commandlineExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.config.workflows.map((workflow): SearchResultItem => {
                return {
                    description: workflow.description,
                    executionArgument: this.encodeExecutionArguments(workflow),
                    hideMainWindowAfterExecution: true,
                    icon: workflow.icon || this.defaultWorkflowIcon,
                    name: workflow.name,
                    originPluginType: this.pluginType,
                    searchable: workflow.tags.concat([workflow.name]),
                };
            });

            resolve(result);
        });
    }

    public refreshIndex(): Promise<void> {
        return Promise.resolve();
    }

    public clearCache(): Promise<void> {
        return Promise.resolve();
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises = this.decodeExecutionArgument(searchResultItem.executionArgument).executionArguments
                .map((executionArgument) => this.handleExecutionArgument(executionArgument));

            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.workflowOptions;
            resolve();
        });
    }

    private encodeExecutionArguments(workflow: Workflow): string {
        return JSON.stringify(workflow);
    }

    private decodeExecutionArgument(executionArgument: string): Workflow {
        return JSON.parse(executionArgument) as Workflow;
    }

    private handleExecutionArgument(executionArgument: WorkflowExecutionArgument): Promise<void> {
        switch (executionArgument.executionArgumentType) {
            case WorkflowExecutionArgumentType.CommandlineTool:
                return this.commandlineExecutor(executionArgument.executionArgument);
            case WorkflowExecutionArgumentType.FilePath:
                return this.filePathExecutor(executionArgument.executionArgument);
            case WorkflowExecutionArgumentType.URL:
                return this.urlExecutor(executionArgument.executionArgument);
        }
    }
}
