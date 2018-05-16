import * as dark from "../scss/dark.scss";
import * as light from "../scss/light.scss";
import * as atomOneDark from "../scss/atom-one-dark.scss";
import * as darkMono from "../scss/dark-mono.scss";
import * as lightMono from "../scss/light-mono.scss";

export class ColorThemeLoader {
    private colorThemes: any[];

    constructor() {
        this.colorThemes = [
            dark,
            light,
            atomOneDark,
            darkMono,
            lightMono,
        ];
    }
}
