export function formatNumberSeparator(numberToFormat:string, separator:string) {
        const numParts = numberToFormat.split(".");
        numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return numParts.join(".");
}