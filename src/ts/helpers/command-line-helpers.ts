import { CommandLineProgram } from "../command-line-program";
import { StringHelpers } from "./string-helpers";

export class CommandLineHelpers {
    public static readonly commandLinePrefix = ">";

    public static buildCommand(executionArgument: string): CommandLineProgram {
        const words = StringHelpers.stringToWords(executionArgument);
        const command = words[0].replace(CommandLineHelpers.commandLinePrefix, "");
        const args = [] as string[];

        for (let i = 0; i < words.length; i++) {
            if (i === 0) {
                continue;
            }

            args.push(words[i]);
        }

        return {
            args,
            name: command,
        } as CommandLineProgram;
    }
}
