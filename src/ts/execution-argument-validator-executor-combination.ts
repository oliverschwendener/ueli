import { ExecutionArgumentValidator } from "./execution-argument-validators/execution-argument-validator";
import { Executor } from "./executors/executor";

export interface ExecutionArgumentValidatorExecutorCombination {
    executor: Executor;
    validator: ExecutionArgumentValidator;
}
