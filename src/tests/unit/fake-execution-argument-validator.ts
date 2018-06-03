import { ExecutionArgumentValidator } from "../../ts/execution-argument-validators/execution-argument-validator";

export class FakeExecutionArgumentValidator implements ExecutionArgumentValidator {
    private returnValue: boolean;

    constructor(returnValue: boolean) {
        this.returnValue = returnValue;
    }

    public isValidForExecution(executionArgument: string): boolean {
        return this.returnValue;
    }
}
