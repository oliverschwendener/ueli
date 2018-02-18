import { Config } from "../config";
import { StringHelpers } from "./string-helpers";

export class CommandLineHelpers {
    public static  buildCommand(executionArgument: string): CommandLineProgram {
        let words = StringHelpers.stringToWords(executionArgument);
        let command = words[0].replace(Config.commandLinePrefix, "");
        let args = [] as string[];

        for (let i = 0; i < words.length; i++) {
            if (i === 0) {
                continue;
            }

            args.push(words[i]);
        }

        return <CommandLineProgram>{
            name: command,
            args: args
        };
    }
}

export class CommandLineProgram {
    public name: string;
    public args: string[];
}