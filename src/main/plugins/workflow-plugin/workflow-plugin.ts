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

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.config.workflows.map((workflow): SearchResultItem => {
                return {
                    description: workflow.description,
                    executionArgument: this.encodeExecutionArguments(workflow.executionArguments),
                    hideMainWindowAfterExecution: true,
                    icon: {
                        parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                        <g id="surface1">
                        <path style=" " d="M 25 2 C 22.527344 2 20.316406 2.730469 18.6875 3.96875 C 17.332031 4.996094 16.378906 6.402344 16.09375 8 L 3 8 C 1.355469 8 0 9.355469 0 11 L 0 27.8125 C -0.0078125 27.875 -0.0078125 27.9375 0 28 L 0 45 C 0 46.644531 1.355469 48 3 48 L 47 48 C 48.644531 48 50 46.644531 50 45 L 50 27.90625 C 50 27.875 50 27.84375 50 27.8125 L 50 11 C 50 9.355469 48.644531 8 47 8 L 33.90625 8 C 33.621094 6.402344 32.667969 4.996094 31.3125 3.96875 C 29.683594 2.730469 27.472656 2 25 2 Z M 25 4 C 27.082031 4 28.863281 4.628906 30.09375 5.5625 C 31.007813 6.257813 31.621094 7.078125 31.875 8 L 18.125 8 C 18.378906 7.078125 18.992188 6.257813 19.90625 5.5625 C 21.136719 4.628906 22.917969 4 25 4 Z M 3 10 L 47 10 C 47.566406 10 48 10.433594 48 11 L 48 27.8125 C 47.996094 27.855469 47.996094 27.894531 48 27.9375 L 48 28 C 48 28.566406 47.566406 29 47 29 L 30 29 C 30 27.355469 28.644531 26 27 26 L 23 26 C 21.355469 26 20 27.355469 20 29 L 3 29 C 2.433594 29 2 28.566406 2 28 C 2.007813 27.9375 2.007813 27.875 2 27.8125 L 2 11 C 2 10.433594 2.433594 10 3 10 Z M 23 28 L 27 28 C 27.566406 28 28 28.433594 28 29 L 28 29.8125 C 28 29.84375 28 29.875 28 29.90625 L 28 30 C 27.992188 30.074219 27.992188 30.144531 28 30.21875 L 28 31 C 28 31.566406 27.566406 32 27 32 L 23 32 C 22.433594 32 22 31.566406 22 31 L 22 30.1875 C 22.027344 30.054688 22.027344 29.914063 22 29.78125 L 22 29 C 22 28.433594 22.433594 28 23 28 Z M 2 30.8125 C 2.316406 30.925781 2.648438 31 3 31 L 20 31 C 20 32.644531 21.355469 34 23 34 L 27 34 C 28.644531 34 30 32.644531 30 31 L 47 31 C 47.351563 31 47.683594 30.925781 48 30.8125 L 48 45 C 48 45.566406 47.566406 46 47 46 L 3 46 C 2.433594 46 2 45.566406 2 45 Z "></path>
                        </g>
                        </svg>`,
                        type: IconType.SVG,
                    },
                    name: workflow.name,
                    originPluginType: this.pluginType,
                    searchable: workflow.tags.concat([workflow.name]),
                };
            });

            resolve(result);
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve) => resolve());
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve) => resolve());
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            const executionArguments = this.decodeExecutionArgument(searchResultItem.executionArgument);
            executionArguments.forEach((executionArgument) => {
                switch (executionArgument.executionArgumentType) {
                    case WorkflowExecutionArgumentType.CommandlineTool:
                        this.commandlineExecutor(executionArgument.executionArgument);
                        break;
                    case WorkflowExecutionArgumentType.FilePath:
                        this.filePathExecutor(executionArgument.executionArgument);
                        break;
                    case WorkflowExecutionArgumentType.URL:
                        this.urlExecutor(executionArgument.executionArgument);
                        break;
                }
            });
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

    private encodeExecutionArguments(executionArguments: WorkflowExecutionArgument[]): string {
        return JSON.stringify(executionArguments);
    }

    private decodeExecutionArgument(executionArgument: string): WorkflowExecutionArgument[] {
        return JSON.parse(executionArgument) as WorkflowExecutionArgument[];
    }
}
