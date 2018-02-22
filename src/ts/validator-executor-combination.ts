import { ExecutionArgumentValidator } from "./execution-argument-validators/execution-argument-validator";
import { Executor } from "./executors/executor";

export class ValidatorExecutorCombination {
    public executor: Executor;
    public validator: ExecutionArgumentValidator;
}
