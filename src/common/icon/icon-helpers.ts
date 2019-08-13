import { IconType } from "./icon-type";
import { Icon } from "./icon";

export function isValidIconType(iconType: IconType): boolean {
    return iconType !== undefined
        && Object.values(IconType).find((i) => i === iconType) !== undefined;
}

export function isValidIcon(icon: Icon): boolean {
    return icon !== undefined
        && this.isValidIconType(icon.type)
        && icon.parameter !== undefined
        && icon.parameter.length > 0
        && this.isValidIconParameter(icon);
}

export function isValidIconParameter(icon: Icon): boolean {
    if (icon.type === IconType.SVG) {
        return icon.parameter.startsWith("<svg")
            && icon.parameter.endsWith("</svg>");
    }

    if (icon.type === IconType.URL) {
        return true;
    }

    return false;
}
