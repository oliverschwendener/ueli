import levenshtein from 'fast-levenshtein';

export default class Helpers {
    stringContainsSubstring(stringToSearch, substring) {
        let wordsOfSubstring = this.splitStringToArray(substring.toLowerCase());
        stringToSearch = stringToSearch.split(' ').join('').toLowerCase();

        for (let word of wordsOfSubstring)
            if (stringToSearch.indexOf(word) === -1)
                return false;

        return true;
    }

    splitStringToArray(string) {
        return string.split(/\s+/);
    }

    getWeight(stringToSearch, value) {
        let result = [];
        let stringToSearchWords = this.splitStringToArray(stringToSearch);
        let valueWords = this.splitStringToArray(value);

        for (let word of stringToSearchWords)
            for (let value of valueWords)
                result.push(levenshtein.get(word, value));

        return this.getAvg(result);
    }

    getAvg(numbers) {
        let sum = 0;

        for (let value of numbers)
            sum = sum + value;

        return sum / numbers.length;
    }
}