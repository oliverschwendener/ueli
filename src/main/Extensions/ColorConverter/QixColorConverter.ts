import Color from "color";
import type { ColorConversionResult } from "./ColorConversionResult";
import type { ColorConverter } from "./ColorConverter";

export class QixColorConverter implements ColorConverter {
    public convertFromString(value: string): ColorConversionResult[] {
        const color = this.extractColorFromString(value);

        const name = color?.keyword() ?? "";

        return color
            ? [
                  { format: "HEX", value: color.hex(), name },
                  { format: "HSL", value: color.hsl().string(), name },
                  { format: "RGB", value: color.rgb().string(), name },
              ]
            : [];
    }

    public getRgbColor(value: string): string | undefined {
        return this.extractColorFromString(value)?.rgb().string();
    }

    private extractColorFromString(value: string): Color | undefined {
        try {
            return Color(value);
        } catch (error) {
            return undefined;
        }
    }
}
