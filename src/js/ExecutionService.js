import ProgramExecutor from './ProgramExecutor';
import FilePathExecutor from './FilePathExecutor';
import WebUrlExecutor from './WebUrlExecutor';
import CommandLineExecutor from './CommandLineExecutor';
import EzrCommandExecutor from './EzrCommandExecutor';
import WebSearchExecutor from './WebSearchExecutor';

export default class ExecutionService {
    constructor() {
        this.executors = [
            new ProgramExecutor(),
            new FilePathExecutor(),
            new WebUrlExecutor(),
            new CommandLineExecutor(),
            new EzrCommandExecutor(),
            new WebSearchExecutor()
        ];
    }

    execute(executionArgument) {
        for (let executor of this.executors)
            if (executor.isValid(executionArgument)) {
                executor.execute(executionArgument);
                return true;
            }

        return false;
    }
}