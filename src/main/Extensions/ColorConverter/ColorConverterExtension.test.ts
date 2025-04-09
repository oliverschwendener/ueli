import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import { describe, expect, it, vi } from "vitest";
import type { ColorConversionResult } from "./ColorConversionResult";
import type { ColorConverter } from "./ColorConverter";
import { ColorConverterExtension } from "./ColorConverterExtension";
import type { ColorPreviewGenerator } from "./ColorPreviewGenerator";

describe(ColorConverterExtension, () => {
    describe(ColorConverterExtension.prototype.getSearchResultItems, () => {
        it("should return an empty array", async () => {
            const actual = await new ColorConverterExtension(
                <AssetPathResolver>{},
                <SettingsManager>{},
                <Translator>{},
                <ColorConverter>{},
                <ColorPreviewGenerator>{},
            ).getSearchResultItems();
            expect(actual).toEqual([]);
        });
    });

    describe(ColorConverterExtension.prototype.getImage, () => {
        it("should return the correct image", async () => {
            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: vi.fn().mockReturnValue("color-converter.png"),
                getModuleAssetPath: () => "null",
            };

            const colorConverterExtension = new ColorConverterExtension(
                assetPathResolver,
                <SettingsManager>{},
                <Translator>{},
                <ColorConverter>{},
                <ColorPreviewGenerator>{},
            );

            expect(colorConverterExtension.getImage()).toEqual({ url: "file://color-converter.png" });

            expect(assetPathResolver.getExtensionAssetPath).toHaveBeenCalledWith(
                "ColorConverter",
                "color-converter.png",
            );
        });
    });

    describe(ColorConverterExtension.prototype.getSettingDefaultValue, () => {
        const colorConverterExtension = new ColorConverterExtension(
            <AssetPathResolver>{},
            <SettingsManager>{},
            <Translator>{},
            <ColorConverter>{},
            <ColorPreviewGenerator>{},
        );

        it("should return the default formats when passing 'formats' as key", () =>
            expect(colorConverterExtension.getSettingDefaultValue("formats")).toEqual(["HEX", "HSL", "RGB"]));
    });

    describe(ColorConverterExtension.prototype.isSupported, () =>
        it("should return true", () =>
            expect(
                new ColorConverterExtension(
                    <AssetPathResolver>{},
                    <SettingsManager>{},
                    <Translator>{},
                    <ColorConverter>{},
                    <ColorPreviewGenerator>{},
                ).isSupported(),
            ).toBe(true)),
    );

    describe(ColorConverterExtension.prototype.getInstantSearchResultItems, () => {
        it("should return search result items for the enabled formats", () => {
            const t = vi.fn().mockReturnValue("translated string");

            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: vi.fn().mockReturnValue("color-converter.png"),
                getModuleAssetPath: () => "null",
            };

            const translator = <Translator>{
                createT: vi.fn().mockReturnValue({ t }),
            };

            const settingsManager = <SettingsManager>{
                getValue: vi.fn().mockReturnValue(["HEX", "RGB"]),
                updateValue: async () => {},
            };

            const colorConverter = <ColorConverter>{
                convertFromString: vi.fn().mockReturnValue(<ColorConversionResult[]>[
                    { format: "HEX", value: "#FFFFFF" },
                    { format: "HSL", value: "hsl(0, 0%, 100%)" },
                    { format: "RGB", value: "rgb(255, 255, 255)" },
                ]),
                getRgbColor: vi.fn().mockReturnValue("#FFFFFF"),
            };

            const generateImageUrlMock = vi.fn().mockReturnValue("file://preview-image.png");

            const colorPreviewGenerator: ColorPreviewGenerator = {
                generateImageUrl: generateImageUrlMock,
            };

            const colorConverterExtension = new ColorConverterExtension(
                assetPathResolver,
                settingsManager,
                translator,
                colorConverter,
                colorPreviewGenerator,
            );

            const { before, after } = colorConverterExtension.getInstantSearchResultItems("#fff");

            expect(before).toEqual([]);

            expect(colorConverter.convertFromString).toHaveBeenCalledOnce();
            expect(colorConverter.convertFromString).toHaveBeenCalledWith("#fff");

            expect(after.length).toBe(2);
            expect(after.map((a) => a.name)).toEqual(["#FFFFFF", "rgb(255, 255, 255)"]);

            expect(after.map(({ image }) => image)).toEqual([
                { url: "file://preview-image.png" },
                { url: "file://preview-image.png" },
            ]);
        });
    });

    describe(ColorConverterExtension.prototype.getI18nResources, () =>
        it("should support en-US, de-CH and ja-JP", () =>
            expect(
                Object.keys(
                    new ColorConverterExtension(
                        <AssetPathResolver>{},
                        <SettingsManager>{},
                        <Translator>{},
                        <ColorConverter>{},
                        <ColorPreviewGenerator>{},
                    ).getI18nResources(),
                ),
            ).toEqual(["en-US", "de-CH", "ja-JP"])),
    );
});
