import type { ColorConversionResult } from "./ColorConversionResult";

export interface ColorConverter {
    convertFromString(value: string): ColorConversionResult[];
}
