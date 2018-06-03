import { Executor } from "../../ts/executors/executor";

export class FakeExecutor implements Executor {
    public hasBeenExecuted: boolean;
    private shouldHideAfterExecution: boolean;
    private shouldResetUserInputAfterExecution: boolean;
    private shouldLogExecution: boolean;

    constructor(shouldHideAfterExecution: boolean, shouldResetUserInputAfterExecution: boolean, shouldLogExecution: boolean) {
        this.shouldHideAfterExecution = shouldHideAfterExecution;
        this.shouldResetUserInputAfterExecution = shouldResetUserInputAfterExecution;
        this.shouldLogExecution = shouldLogExecution;

        this.hasBeenExecuted = false;
    }

    public execute(executionArgument: string): void {
        this.hasBeenExecuted = true;
    }

    public hideAfterExecution(): boolean {
        return this.shouldHideAfterExecution;
    }

    public resetUserInputAfterExecution(): boolean {
        return this.shouldResetUserInputAfterExecution;
    }

    public logExecution(): boolean {
        return this.shouldLogExecution;
    }
}
