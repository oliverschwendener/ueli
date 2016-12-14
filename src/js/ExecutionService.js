import ProgramExecutor from './ProgramExecutor.js';
import FilePathExecutor from './FilePathExecutor.js';

export default class ExecutionService {
    constructor() {
        this.executors = [
            new ProgramExecutor(),
            new FilePathExecutor()
        ];
    }

    execute(arg) {
        for (let executor of this.executors)
            if (executor.isValid(arg)) {
                executor.execute(arg);
                break;
            }
    }
}