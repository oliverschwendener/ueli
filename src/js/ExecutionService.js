import { exec } from 'child_process'
import path from 'path'

export default class ExecutionService {
    execute(filePath) {
        let args = `start "" "${filePath}"`

        exec(args, (err, stdout, sterr) => {
            if (err) throw err
        })
    }
    
    openFileLocation(filePath) {        
        let fileLocation = path.dirname(filePath);
        let command = `start "" "${fileLocation}"`

        exec(command, (err, stout, sterr) => {
            if (err) throw err
        })
    }
}