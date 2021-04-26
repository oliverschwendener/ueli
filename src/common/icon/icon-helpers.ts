import { IconType } from "./icon-type";
import { Icon } from "./icon";
import { isValidColorCode } from "../../main/plugins/color-converter-plugin/color-converter-helpers";
import { TranslationSet } from "../translation/translation-set";

export function isValidIconType(iconType: IconType | string): boolean {
    return iconType !== undefined && Object.values(IconType).some((i) => i === iconType);
}

export function isValidIcon(icon: Icon): boolean {
    return (
        icon !== undefined &&
        this.isValidIconType(icon.type) &&
        icon.parameter !== undefined &&
        icon.parameter.length > 0 &&
        isValidIconParameter(icon)
    );
}

export function getIconTypeLabel(iconType: IconType, translations: TranslationSet): string {
    switch (iconType) {
        case IconType.Color:
            return translations.iconTypeColor;
        case IconType.SVG:
            return "SVG";
        case IconType.URL:
            return "URL";
    }
}

function isValidIconParameter(icon: Icon): boolean {
    if (icon.parameter.trim().length === 0) {
        return false;
    }

    if (icon.type === IconType.SVG) {
        return icon.parameter.trim().startsWith("<svg") && icon.parameter.trim().endsWith("</svg>");
    }

    if (icon.type === IconType.URL) {
        return true;
    }

    if (icon.type === IconType.Color) {
        return isValidColorCode(icon.parameter);
    }

    return false;
}
