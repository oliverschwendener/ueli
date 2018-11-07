import { Executor } from "../../ts/executors/executor";

export class FakeExecutor implements Executor {
    public hasBeenExecuted: boolean;
    public hideAfterExecution: boolean;
    public logExecution: boolean;
    public resetUserInputAfterExecution: boolean;

    constructor(shouldHideAfterExecution: boolean, shouldResetUserInputAfterExecution: boolean, shouldLogExecution: boolean) {
        this.hideAfterExecution = shouldHideAfterExecution;
        this.logExecution = shouldLogExecution;
        this.resetUserInputAfterExecution = shouldResetUserInputAfterExecution;

        this.hasBeenExecuted = false;
    }

    public execute(executionArgument: string): void {
        this.hasBeenExecuted = true;
    }
}
