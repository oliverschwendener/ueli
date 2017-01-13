import ProgramExecutor from './ProgramExecutor.js';
import FilePathExecutor from './FilePathExecutor.js';
import WebUrlExecutor from './WebUrlExecutor.js';
import CommandLineExecutor from './CommandLineExecutor.js';
import EzrCommandExecutor from './EzrCommandExecutor.js';
import WebSearchExecutor from './WebSearchExecutor.js';

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