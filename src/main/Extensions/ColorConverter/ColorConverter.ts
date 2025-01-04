import type { ColorConversionResult } from "./ColorConversionResult";

export interface ColorConverter {
    convertFromString(value: string): ColorConversionResult[];
    getRgbColor(value: string): string | undefined;
}
