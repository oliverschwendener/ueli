import { IconType } from "./icon-type";

export class IconTypeHelpers {
    public static isValidIconType(iconType: IconType): boolean {
        return Object.values(IconType).find((i) => i === iconType) !== undefined;
    }
}
