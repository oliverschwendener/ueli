import { VariableSearchPlugin } from "../../../ts/search-plugins/variable-plugin";
import { ConfigOptions } from "../../../ts/config-options";
import { Injector } from "../../../ts/injector";
import { InputValidator } from "../../../ts/input-validators/input-validator";

const defaultConfig = {
    directoryVariables: [
        {
            name: "custom",
            path: "F:\\Custom\\Path",
        },
    ],
} as ConfigOptions;

class FilePathInputValidator implements InputValidator {
    public isValidForSearchResults(userInput: string): boolean {
        const regex = Injector.getFilePathRegExp("win32");
        return regex.test(userInput);
    }
}

describe(VariableSearchPlugin.name, (): void => {
    const fakeVariables = {
        Gallery: "E:\\Camera\\DCIM",
        notAPath: "420",
        topsecretfolder: "D:\\Softwares\\Installers\\temp\\LoliPic",
    };
    const searchPlugin = new VariableSearchPlugin(new FilePathInputValidator(), fakeVariables);

    describe(searchPlugin.getAllItems.name, (): void => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBeGreaterThan(0);
        });
    });
});
