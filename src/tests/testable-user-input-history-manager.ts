import { UserInputHistoryManager } from "../main/user-input-history-manager";

export class TestableUserInputHistoryManager extends UserInputHistoryManager {
    constructor() {
        super();
    }

    public getHistory(): string[] {
        return this.history;
    }

    public setHistory(history: string[]): void {
        this.history = history;
        this.index = this.history.length;
    }

    public getIndex(): number {
        return this.index;
    }

    public setIndex(index: number): void {
        this.index = index;
    }
}
