export default class Helper {

    stringIsUndefinedEmptyOrWhitespaces(string) {
        let stringWithoutWhitespaces = string.replace(' ', '');
        return stringWithoutWhitespaces === undefined
            || stringWithoutWhitespaces === '';
    }

    splitStringToArray(string) {
        return string.split(/\s+/);
    }

    getAvg(array) {
        let sum = 0;

        for (let value of array)
            sum = sum + value;

        return sum / array.length;
    }

}