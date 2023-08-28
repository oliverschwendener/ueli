export interface PowershellUtility {
    executePowershellScript(powershellScript: string): Promise<string>;
}
