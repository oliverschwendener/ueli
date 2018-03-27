import { ExecutionArgumentValidator } from "./execution-argument-validators/execution-argument-validator";
import { Executor } from "./executors/executor";

export class ExecutionArgumentValidatorExecutorCombination {
    public executor: Executor;
    public validator: ExecutionArgumentValidator;
}
