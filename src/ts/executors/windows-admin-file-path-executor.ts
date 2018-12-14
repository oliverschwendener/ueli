import { Executor } from "./executor";
import shell = require("node-powershell");

export class WindowsAdminFilePathExecutor implements Executor {
    public readonly hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = true;

    public execute(executionArgument: string): void {
        const ps = new shell({
            debugMsg: false,
            executionPolicy: "Bypass",
            noProfile: true,
        });

        ps.addCommand(`Start-Process -Verb runas "${executionArgument}"`);
        ps.invoke().then(() => {
            ps.dispose();
        }).catch((err) => {
            // tslint:disable-next-line:no-console
            console.log(err);
            ps.dispose();
        });
    }
}
