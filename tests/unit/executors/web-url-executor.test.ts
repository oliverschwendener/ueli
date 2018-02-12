import { expect } from "chai";
import { WebUrlExecutor } from "./../../../src/ts/executors/web-url-executor";

describe("windows file path executor", () => {
    describe("is valid for execution", () => {
        let executor = new WebUrlExecutor();

        it("should return true when passing in a valid file path", () => {
            let validUrls = [
                "https://google.com",
                "https://github.com/some-user",
                "www.google.com",
                "google.com",
                "google.com/?query=search-something&param=gugus"
            ];

            for (let validUrl of validUrls) {
                let actual = executor.isValidForExecution(validUrl);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid file path", () => {
            let invalidUrls = [
                "this is some shit",
                "/this/is/not/a/url"
            ];

            for (let invalidUrl of invalidUrls) {
                let actual = executor.isValidForExecution(invalidUrl);
                expect(actual).to.be.false;
            }
        });
    });
});