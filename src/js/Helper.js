export default class Helper {
    StringIsUndefinedEmptyOrWhitespaces(string) {
        let stringWithoutWhitespaces = string.replace(' ', '');
        return stringWithoutWhitespaces === undefined
            || stringWithoutWhitespaces === '';
    }
}