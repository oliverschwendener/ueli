import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSearcher } from "../FileSearcher";

export class MdfindFileSearcher implements FileSearcher {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async getFilePathsBySearchTerm(searchTerm: string, maxSearchResultCount: number): Promise<string[]> {
        const escapedSearchTerm = `'${searchTerm.replace(/'/g, "'\\''")}'`;
        const commands = [`mdfind -name ${escapedSearchTerm}`, `head -n ${maxSearchResultCount}`];
        const stdout = await this.commandlineUtility.executeCommand(commands.join(" | "), { ignoreStdErr: true });
        return stdout.split("\n").filter((filePath) => filePath.trim().length > 0);
    }
}
