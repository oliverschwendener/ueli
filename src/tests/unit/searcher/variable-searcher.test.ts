import { VariableSearcher } from "../../../ts/searcher/variable-searcher";
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

describe(VariableSearcher.name, (): void => {
    const fakeVariables = {
        Gallery: "E:\\Camera\\DCIM",
        notAPath: "420",
        topsecretfolder: "D:\\Softwares\\Installers\\temp\\LoliPic",
    };
    const searcher = new VariableSearcher(defaultConfig, new FilePathInputValidator(), fakeVariables);

    describe(searcher.getSearchResult.name, (): void => {
        it("Should return directory path as execution argument", (): void => {
            expect(searcher.getSearchResult("topsecretfolder")[0].executionArgument).toBe(fakeVariables.topsecretfolder);
        });

        it("Should return original name", (): void => {
            expect(searcher.getSearchResult("GALLERY")[0].name).toBe("Gallery");
        });

        it("Should not return variable that isn't a path", (): void => {
            expect(searcher.getSearchResult("notAPath").length).toBe(0);
        });
    });
});
