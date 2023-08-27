import Powershell from "node-powershell";

export class PowershellUtility {
    public static async executePowershellScript(
        powershellScript: string,
        shellOptions: Powershell.ShellOptions = {
            noProfile: true,
            executionPolicy: "Bypass",
            verbose: false,
        },
    ): Promise<string> {
        const powershell = new Powershell(shellOptions);

        try {
            await powershell.addCommand(powershellScript);
        } catch (error) {
            throw new Error(`Failed to add powershell command. Reason: ${error}`);
        }

        try {
            return await powershell.invoke();
        } catch (error) {
            throw new Error(`Powershell script execution failed. Reason: ${error}`);
        } finally {
            await powershell.dispose();
        }
    }
}
