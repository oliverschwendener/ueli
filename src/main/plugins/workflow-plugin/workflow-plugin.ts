import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SearchPlugin } from "../../search-plugin";
import { WorkflowOptions } from "../../../common/config/workflow-options";
import { WorkflowExecutionStep } from "./workflow-execution-argument";
import { WorkflowExecutionArgumentType } from "./workflow-execution-argument-type";
import { Workflow } from "./workflow";
import { defaultWorkflowIcon } from "../../../common/icon/default-icons";
import { WindowsShell, MacOsShell } from "../commandline-plugin/shells";
import { CommandlineOptions } from "../../../common/config/commandline-options";

export class WorkflowPlugin implements SearchPlugin {
    public pluginType = PluginType.Workflow;
    private config: WorkflowOptions;
    private readonly commandlineOptions: CommandlineOptions;
    private readonly filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly commandlineExecutor: (command: string, shell: WindowsShell | MacOsShell) => Promise<void>;

    constructor(
        config: WorkflowOptions,
        commandlineOptions: CommandlineOptions,
        filePathExecutor: (filePath: string, privileged?: boolean) => Promise<void>,
        urlExecutor: (url: string) => Promise<void>,
        commandlineExecutor: (command: string, shell: WindowsShell | MacOsShell) => Promise<void>,
    ) {
        this.config = config;
        this.commandlineOptions = commandlineOptions;
        this.filePathExecutor = filePathExecutor;
        this.urlExecutor = urlExecutor;
        this.commandlineExecutor = commandlineExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.config.workflows.map(
                (workflow): SearchResultItem => {
                    return {
                        description: workflow.description,
                        executionArgument: this.encodeExecutionArguments(workflow),
                        hideMainWindowAfterExecution: true,
                        icon: workflow.icon || defaultWorkflowIcon,
                        name: workflow.name,
                        needsUserConfirmationBeforeExecution: workflow.needsUserConfirmationBeforeExecution,
                        originPluginType: this.pluginType,
                        searchable: [...workflow.tags, workflow.name],
                    };
                },
            );

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
            const promises = this.decodeExecutionArgument(
                searchResultItem.executionArgument,
            ).executionSteps.map((executionArgument) => this.handleExecutionStep(executionArgument));

            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
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

    private handleExecutionStep(executionStep: WorkflowExecutionStep): Promise<void> {
        switch (executionStep.executionArgumentType) {
            case WorkflowExecutionArgumentType.CommandlineTool:
                return this.commandlineExecutor(executionStep.executionArgument, this.commandlineOptions.shell);
            case WorkflowExecutionArgumentType.FilePath:
                return this.filePathExecutor(executionStep.executionArgument);
            case WorkflowExecutionArgumentType.URL:
                return this.urlExecutor(executionStep.executionArgument);
        }
    }
}
