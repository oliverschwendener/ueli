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

    getWeight(programNameWithExtension, userInput) {
        let results = [];
        let stringToSearchWords = this.splitStringToArray(programNameWithExtension);
        let valueWords = this.splitStringToArray(userInput);

        for (let word of stringToSearchWords)
            for (let value of valueWords) {
                let levenshteinDistance = levenshtein.get(word, value);
                let result = word.startsWith(value)
                    ? (levenshteinDistance / 4)
                    : levenshteinDistance;
                    
                results.push(result);
            }                

        let avgWeigth = this.getAvg(results);

        return avgWeigth;
    }

    getAvg(numbers) {
        let sum = 0;

        for (let value of numbers)
            sum = sum + value;

        return sum / numbers.length;
    }

    stringIsEmptyOrWhitespaces(string) {
        return (/^\s+$/.test(string));
    }
}