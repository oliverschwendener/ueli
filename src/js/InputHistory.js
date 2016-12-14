export default class InputHistory {
    constructor() {
        this.history = [];
        this.index = 1;
    }

    addItem(item) {
        if (item === '' || item === undefined)
            return;

        this.history.push(item);
        this.index = this.history.length;
    }

    getPrevious() {
        if (this.index > 0)
            this.index--;

        return this.history[this.index];
    }

    getNext() {
        if (this.index < this.history.length)
            this.index++;

        return this.history[this.index];
    }
}