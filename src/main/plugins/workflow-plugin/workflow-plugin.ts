import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SearchPlugin } from "../../search-plugin";
import { WorkflowOptions } from "../../../common/config/workflow-options";
import { WorkflowExecutionStep } from "./workflow-execution-argument";
import { WorkflowExecutionArgumentType } from "./workflow-execution-argument-type";
import { Workflow } from "./workflow";
import { defaultWorkflowIcon } from "../../../common/icon/default-icons";

export class WorkflowPlugin implements SearchPlugin {
    public pluginType = PluginType.Workflow;
    public openLocationSupported = false;
    public autoCompletionSupported = false;
    private config: WorkflowOptions;
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly commandlineExecutor: (command: string) => Promise<void>;

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

    public async getAll(): Promise<SearchResultItem[]> {
        const result = this.config.workflows.map((workflow): SearchResultItem => {
            return {
                description: workflow.description,
                executionArgument: this.encodeExecutionArguments(workflow),
                hideMainWindowAfterExecution: true,
                icon: workflow.icon || defaultWorkflowIcon,
                name: workflow.name,
                originPluginType: this.pluginType,
                searchable: workflow.tags.concat([workflow.name]),
            };
        });
        return result;
    }
    public async refreshIndex(): Promise<void> {} // tslint:disable-line

    public async clearCache(): Promise<void> {} // tslint:disable-line

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        const promises = this.decodeExecutionArgument(searchResultItem.executionArgument).executionSteps
            .map((executionArgument) => this.handleExecutionStep(executionArgument));
        try {
            await Promise.all(promises);
        } catch (error) {
            return error;
        }
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.workflowOptions;
    }

    private encodeExecutionArguments(workflow: Workflow): string {
        return JSON.stringify(workflow);
    }

    private decodeExecutionArgument(executionArgument: string): Workflow {
        return JSON.parse(executionArgument) as Workflow;
    }

    private handleExecutionStep(executionStep: WorkflowExecutionStep): Promise<void> {
        switch (executionStep.executionArgumentType) {
            case WorkflowExecutionArgumentType.CommandlineTool:
                return this.commandlineExecutor(executionStep.executionArgument);
            case WorkflowExecutionArgumentType.FilePath:
                return this.filePathExecutor(executionStep.executionArgument);
            case WorkflowExecutionArgumentType.URL:
                return this.urlExecutor(executionStep.executionArgument);
        }
    }
}
