import * as dark from "../scss/dark.scss";
import * as light from "../scss/light.scss";

export class ColorThemeLoader {
    private colorThemes: any[];

    constructor() {
        this.colorThemes = [
            dark,
            light,
        ];
    }
}
