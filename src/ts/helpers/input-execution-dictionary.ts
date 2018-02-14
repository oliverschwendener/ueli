import { ExecutionArgumentValidator } from "../execution-argument-validators/execution-argument-validator";
import { Executor } from "../executors/executor";

export class InputExecutionDictionaryItem {
    public inputValidator: ExecutionArgumentValidator;
    public executor: Executor;
}