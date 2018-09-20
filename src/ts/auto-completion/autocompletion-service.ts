import { AutoCompletionValidator } from "./autocompletion-validator";

export class AutoCompletionService {
    private validators: AutoCompletionValidator[];

    constructor(validators: AutoCompletionValidator[]) {
        this.validators = validators;
    }

    public getAutocompletionResult(executionArgument: string): string | undefined {
        for (const validator of this.validators) {
            if (validator.isValidForAutoCompletion(executionArgument)) {
                return validator.getAutoCompletionResult(executionArgument);
            }
        }
    }
}
