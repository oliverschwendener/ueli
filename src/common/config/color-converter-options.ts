export interface ColorConverterOptions {
    isEnabled: boolean;
    hexEnabled: boolean;
    rgbEnabled: boolean;
    rgbaEnabled: boolean;
    hslEnabled: boolean;
    showColorPreview: boolean;
}

export const defaultColorConverterOptions: ColorConverterOptions = {
    hexEnabled: true,
    hslEnabled: true,
    isEnabled: true,
    rgbEnabled: true,
    rgbaEnabled: true,
    showColorPreview: false,
};
