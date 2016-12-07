export default class Helper {

    StringIsUndefinedEmptyOrWhitespaces(string) {
        let stringWithoutWhitespaces = string.replace(' ', '');
        return stringWithoutWhitespaces === undefined
            || stringWithoutWhitespaces === '';
    }

    SplitStringToArray(string) {
        return string.split(/\s+/);
    }

    GetAvg(array) {
        let sum = 0;

        for (let value of array)
            sum = sum + value;

        return sum / array.length;
    }
    
}