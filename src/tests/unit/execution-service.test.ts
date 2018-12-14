import { ExecutionService } from "../../ts/execution-service";
import { ExecutionArgumentValidatorExecutorCombination } from "../../ts/execution-argument-validator-executor-combination";
import { CountManager } from "../../ts/count/count-manager";
import { FakeCountRepository } from "./fake-count-repository";
import { UserConfigOptions } from "../../ts/user-config/user-config-options";
import { FakeExecutor } from "./fake-executor";
import { FakeExecutionArgumentValidator } from "./fake-execution-argument-validator";
import { FakeIpcEmitter } from "./fake-ipc-emitter";

describe(ExecutionService.name, (): void => {
    describe("execute", (): void => {
        it("should execute as admin", (): void => {
            const hideAfterExecution = false;
            const resetUserInputAfterExecution = true;
            const logExecution = true;

            const executor = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);
            const adminCombinations: ExecutionArgumentValidatorExecutorCombination[] = [
                {
                    executor,
                    validator: new FakeExecutionArgumentValidator(true),
                },
            ];

            const countManager = new CountManager(new FakeCountRepository({}));
            const config = { logExecution } as UserConfigOptions;
            const ipcEmitter = new FakeIpcEmitter();

            const executionService = new ExecutionService([], adminCombinations, countManager, config, ipcEmitter);
            executionService.executeAsAdmin("exec");

            expect(executor.hasBeenExecuted).toBe(true);
        });

        it("should execute only the first combination if the execution argument matches the validator", (): void => {
            const hideAfterExecution = false;
            const resetUserInputAfterExecution = false;
            const logExecution = false;

            const executor1 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);
            const executor2 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);

            const combinations: ExecutionArgumentValidatorExecutorCombination[] = [
                {
                    executor: executor1,
                    validator: new FakeExecutionArgumentValidator(true),
                },
                {
                    executor: executor2,
                    validator: new FakeExecutionArgumentValidator(true),
                },
            ];

            const countManager = new CountManager(new FakeCountRepository({}));
            const config = { logExecution } as UserConfigOptions;
            const ipcEmitter = new FakeIpcEmitter();
            const executionService = new ExecutionService(combinations, [], countManager, config, ipcEmitter);

            executionService.execute("execution argument");

            expect(executor1.hasBeenExecuted).toBe(true);
            expect(executor2.hasBeenExecuted).toBe(false);
        });

        it("should execute nothing if the execution argument does not match any validator", (): void => {
            const hideAfterExecution = false;
            const resetUserInputAfterExecution = false;
            const logExecution = false;

            const executor1 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);
            const executor2 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);

            const combinations: ExecutionArgumentValidatorExecutorCombination[] = [
                {
                    executor: executor1,
                    validator: new FakeExecutionArgumentValidator(false),
                },
                {
                    executor: executor2,
                    validator: new FakeExecutionArgumentValidator(false),
                },
            ];

            const countManager = new CountManager(new FakeCountRepository({}));
            const config = { logExecution } as UserConfigOptions;
            const ipcEmitter = new FakeIpcEmitter();
            const executionService = new ExecutionService(combinations, [], countManager, config, ipcEmitter);

            executionService.execute("execution argument");

            expect(executor1.hasBeenExecuted).toBe(false);
            expect(executor2.hasBeenExecuted).toBe(false);
        });

        it("should emit 'resetUserInput' if the executed executor wants to reset the user input", (): void => {
            const resetUserInputAfterExecution = true;
            const hideAfterExecution = false;
            const logExecution = false;

            const executor1 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);

            const combinations: ExecutionArgumentValidatorExecutorCombination[] = [
                {
                    executor: executor1,
                    validator: new FakeExecutionArgumentValidator(true),
                },
            ];

            const countManager = new CountManager(new FakeCountRepository({}));
            const config = { logExecution } as UserConfigOptions;
            const ipcEmitter = new FakeIpcEmitter();
            const executionService = new ExecutionService(combinations, [], countManager, config, ipcEmitter);

            executionService.execute("execution argument");

            expect(ipcEmitter.userInputHasBeenReset).toBe(true);
        });

        it("should emit 'hideWindow' if the executed executor wants to hide the window", (): void => {
            const resetUserInputAfterExecution = false;
            const hideAfterExecution = true;
            const logExecution = false;

            const executor1 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);

            const combinations: ExecutionArgumentValidatorExecutorCombination[] = [
                {
                    executor: executor1,
                    validator: new FakeExecutionArgumentValidator(true),
                },
            ];

            const countManager = new CountManager(new FakeCountRepository({}));
            const config = { logExecution } as UserConfigOptions;
            const ipcEmitter = new FakeIpcEmitter();
            const executionService = new ExecutionService(combinations, [], countManager, config, ipcEmitter);

            executionService.execute("execution argument");

            expect(ipcEmitter.windowHasBeenHidden).toBe(true);
        });

        it("should log execution if the executor wants to log execution and the config is set to log the execution", (): void => {
            const resetUserInputAfterExecution = false;
            const hideAfterExecution = false;
            const logExecution = true;

            const executor1 = new FakeExecutor(hideAfterExecution, resetUserInputAfterExecution, logExecution);

            const combinations: ExecutionArgumentValidatorExecutorCombination[] = [
                {
                    executor: executor1,
                    validator: new FakeExecutionArgumentValidator(true),
                },
            ];

            const countManager = new CountManager(new FakeCountRepository({}));
            const config = { logExecution } as UserConfigOptions;
            const ipcEmitter = new FakeIpcEmitter();
            const executionService = new ExecutionService(combinations, [], countManager, config, ipcEmitter);

            executionService.execute("exec");

            const actual = countManager.getCount();
            expect(actual.exec).toBe(1);
        });
    });
});
