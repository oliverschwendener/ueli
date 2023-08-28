import Powershell from "node-powershell";

export class RealPowershellUtility {
    public async executePowershellScript(powershellScript: string): Promise<string> {
        const powershell = new Powershell({
            noProfile: true,
            executionPolicy: "Bypass",
            verbose: false,
        });

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
