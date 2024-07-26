import Color from "color";
import type { ColorConversionResult } from "./ColorConversionResult";
import type { ColorConverter } from "./ColorConverter";

export class QixColorConverter implements ColorConverter {
    public convertFromString(value: string): ColorConversionResult[] {
        const color = this.extractColorFromString(value);

        return color
            ? [
                  { format: "HEX", value: color.hex() },
                  { format: "HSL", value: color.hsl().string() },
                  { format: "RGB", value: color.rgb().string() },
              ]
            : [];
    }

    private extractColorFromString(value: string): Color | undefined {
        try {
            return Color(value);
        } catch (error) {
            return undefined;
        }
    }
}
