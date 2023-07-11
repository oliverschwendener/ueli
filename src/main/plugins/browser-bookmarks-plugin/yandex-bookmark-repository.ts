import { Browser } from "./browser";
import { IconType } from "../../../common/icon/icon-type";
import { Icon } from "../../../common/icon/icon";
import { GoogleChromeBookmarkRepository } from "./google-chrome-bookmark-repository";

export class YandexBookmarkRepository extends GoogleChromeBookmarkRepository {
    public browser = Browser.Yandex;
    public defaultIcon: Icon = {
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient gradientUnits="userSpaceOnUse" y2="516.48" x2="0" y1="546.93" id="a" gradientTransform="matrix(2.65716 0 0 2.66062 -1654.273 -2219.2)"><stop stop-color="#d3d3d3"/><stop offset="1" stop-color="#fcf9f9"/></linearGradient></defs><ellipse style="fill:#fff;fill-opacity:1;stroke:url(#a);stroke-width:2.32688046" cy="24.003" cx="23.979" rx="22.821" ry="22.836"/><path style="fill:red;fill-opacity:1" d="M12.85 9.508 8.608 13.75l12.4 12.401v14.742h6V26.135L39.393 13.75l-4.242-4.242L24 20.659 12.85 9.508"/></svg>`,
        type: IconType.SVG,
    };
}
