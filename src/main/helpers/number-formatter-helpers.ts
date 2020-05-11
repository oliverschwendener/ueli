export function formatNumberSeparator(numberToFormat:string, separator:string) {
        return numberToFormat.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, separator);
}