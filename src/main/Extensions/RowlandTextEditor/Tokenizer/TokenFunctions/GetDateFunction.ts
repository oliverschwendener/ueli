import type { TokenFunction } from "./TokenFunction";

export class GetDateFunction implements TokenFunction {
    public name = "GETDATE";

    public evaluate(params: string[]): string {
        const format = params[0] || "yyyy-MM-ddTHH:mm:ss.000Z";
        return this.formatDate(new Date(), format);
    }

    private formatDate(date: Date, format: string): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

        return format
            .replace(/yyyy/g, String(year))
            .replace(/MM/g, month)
            .replace(/dd/g, day)
            .replace(/HH/g, hours)
            .replace(/mm/g, minutes)
            .replace(/ss/g, seconds)
            .replace(/SSS/g, milliseconds);
    }
}
