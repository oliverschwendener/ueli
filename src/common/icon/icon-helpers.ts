import { IconType } from "./icon-type";
import { Icon } from "./icon";

export class IconHelpers {
    public static isValidIconType(iconType: IconType): boolean {
        return iconType !== undefined
            && Object.values(IconType).find((i) => i === iconType) !== undefined;
    }

    public static isValidIcon(icon: Icon): boolean {
        return icon !== undefined
            && this.isValidIconType(icon.type)
            && icon.parameter !== undefined
            && icon.parameter.length > 0;
    }
}
