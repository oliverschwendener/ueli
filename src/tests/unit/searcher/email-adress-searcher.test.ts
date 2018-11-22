import { EmailAddressSearcher } from "../../../ts/searcher/email-address-searcher";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

describe(EmailAddressSearcher.name, (): void => {
    const searcher = new EmailAddressSearcher(testIconSet);

    describe(searcher.getSearchResult.name, (): void => {
        const userInput = "someone@mail.com";
        const actual = searcher.getSearchResult(userInput);

        expect(actual.length).toBe(1);
        expect(actual[0].description).toBe(`Send an email to ${userInput}`);
        expect(actual[0].executionArgument).toBe(`mailto:${userInput}`);
        expect(actual[0].icon).toBe(testIconSet.emailIcon);
        expect(actual[0].name).toBe(userInput);
        expect(actual[0].searchable.length).toBe(0);
    });

    it("should not block other searchers", (): void => {
        const actual = searcher.blockOthers;
        expect(actual).toBe(false);
    });
});
