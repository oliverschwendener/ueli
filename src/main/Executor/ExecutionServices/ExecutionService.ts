import type { ExecutionArgument } from "@common/ExecutionArgument";

export interface ExecutionService {
    execute(executionArgument: ExecutionArgument): Promise<void>;
}
