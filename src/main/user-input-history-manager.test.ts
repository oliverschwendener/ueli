import { TestableUserInputHistoryManager } from "../tests/testable-user-input-history-manager";

describe(TestableUserInputHistoryManager.name, (): void => {
    describe("addItem", (): void => {
        it("should add an item", (): void => {
            const userInput = "test";

            const manager = new TestableUserInputHistoryManager();

            manager.addItem(userInput);

            const actual = manager.getHistory();

            expect(actual.length).toBe(1);
            expect(actual[0]).toBe(userInput);
            expect(manager.getIndex()).toBe(1);
        });

        it("should only add an item if it's not the same as the previous", (): void => {
            const manager = new TestableUserInputHistoryManager();

            const userInput1 = "test1";
            const userInput2 = "test2";

            manager.addItem(userInput1);
            manager.addItem(userInput1);
            manager.addItem(userInput2);

            const actual = manager.getHistory();

            expect(actual.length).toBe(2);
            expect(actual[0]).toBe(userInput1);
            expect(actual[1]).toBe(userInput2);
            expect(manager.getIndex()).toBe(2);
        });
    });

    describe("getPrevious", (): void => {
        it("should return the previous item", (): void => {
            const history = ["test-1", "test-2", "test-3"];

            const manager = new TestableUserInputHistoryManager();
            manager.setHistory(history);

            for (let i = history.length - 1; i >= 0; i--) {
                const actual = manager.getPrevious();
                expect(actual).toBe(history[i]);
            }
        });

        it("should return the first item when the curren item is already the first", (): void => {
            const history = ["test-1", "test-2", "test-3"];

            const manager = new TestableUserInputHistoryManager();
            manager.setHistory(history);

            history.forEach(() => {
                manager.getPrevious();
            });

            const actual = manager.getPrevious();

            expect(actual).toBe(history[0]);
        });

        it("should return an empty string if history is empty", (): void => {
            const history = [] as string[];
            const manager = new TestableUserInputHistoryManager();
            manager.setHistory(history);

            const actual = manager.getPrevious();

            expect(actual).toBe("");
        });
    });

    describe("getNext", (): void => {
        it("should return the next item", (): void => {
            const history = ["test-1", "test-2", "test-3"];

            const manager = new TestableUserInputHistoryManager();
            manager.setHistory(history);
            manager.setIndex(-1);

            // tslint:disable-next-line:prefer-for-of because we want a for loops
            for (let i = 0; i < history.length; i++) {
                const actual = manager.getNext();
                expect(actual).toBe(history[i]);
            }
        });

        it("should return an empty string when current item is the last", (): void => {
            const history = ["test-1", "test-2", "test-3"];

            const manager = new TestableUserInputHistoryManager();
            manager.setHistory(history);
            manager.setIndex(-1);

            history.forEach(() => {
                manager.getNext();
            });

            const acutal = manager.getNext();

            expect(acutal).toBe("");
        });

        it("should return an ampty string if history is empty", (): void => {
            const history = [] as string[];
            const manager = new TestableUserInputHistoryManager();
            manager.setHistory(history);

            const actual = manager.getNext();

            expect(actual).toBe("");
        });
    });
});
