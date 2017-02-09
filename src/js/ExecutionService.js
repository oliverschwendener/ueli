import { exec } from 'child_process'
import path from 'path'

import ProgramExecutor from './Executors/ProgramExecutor'
import WebUrlExecutor from './Executors/WebUrlExecutor'

export default class ExecutionService {
    constructor() {
        this.executors = [
            new ProgramExecutor(),
            new WebUrlExecutor()
        ]
    }

    execute(execArgs) {
        for (let executor of this.executors)
            if (executor.isValid(execArgs))
                executor.execute(execArgs)
    }   
    
    openFileLocation(filePath) {        
        filePath = path.win32.normalize(filePath)
        let command = `start explorer.exe /select,"${filePath}"`

        exec(command, (err, stout, sterr) => {
            if (err) throw err
        })
    }
}