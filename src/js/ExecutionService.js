import ProgramExecutor from './Executors/ProgramExecutor';
import FilePathExecutor from './Executors/FilePathExecutor';
import WebUrlExecutor from './Executors/WebUrlExecutor';
import CommandLineExecutor from './Executors/CommandLineExecutor';
import EzrCommandExecutor from './Executors/EzrCommandExecutor';
import WebSearchExecutor from './Executors/WebSearchExecutor';

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