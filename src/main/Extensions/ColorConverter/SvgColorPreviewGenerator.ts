import type { ColorPreviewGenerator } from "./ColorPreviewGenerator";

export class SvgColorPreviewGenerator implements ColorPreviewGenerator {
    public generateImageUrl(hexColor: string): string {
        const size = 20;
        const borderRadius = 4;

        return `data:image/svg+xml;utf8,<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" style="fill:${encodeURIComponent(hexColor)}" /></svg>`;
    }
}
