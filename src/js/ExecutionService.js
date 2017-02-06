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
        filePath = path.win32.normalize(filePath)
        let command = `start explorer.exe /select,"${filePath}"`

        exec(command, (err, stout, sterr) => {
            if (err) throw err
        })
    }
}