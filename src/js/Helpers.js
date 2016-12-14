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
}