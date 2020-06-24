export class UserInputHistoryManager {
    protected index: number;
    protected history: string[];

    constructor() {
        this.history = [];
        this.index = this.history.length;
    }

    public addItem(userInput: string): void {
        if (this.history.length > 0) {
            if (this.history[this.history.length - 1] !== userInput) {
                this.history.push(userInput);
            }
        } else {
            this.history.push(userInput);
        }
        this.index = this.history.length;
    }

    public getPrevious(): string {
        if (this.history.length === 0) {
            return "";
        }

        if (this.index !== 0) {
            this.index--;
        }

        return this.history[this.index];
    }

    public getNext(): string {
        if (this.index < this.history.length) {
            this.index++;
        }

        if (this.index >= this.history.length) {
            return "";
        }

        return this.history[this.index];
    }
}
