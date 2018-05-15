import * as dark from "../scss/dark.scss";
import * as light from "../scss/light.scss";
import * as atomOneDark from "../scss/atom-one-dark.scss";

export class ColorThemeLoader {
    private colorThemes: any[];

    constructor() {
        this.colorThemes = [
            dark,
            light,
            atomOneDark,
        ];
    }
}
