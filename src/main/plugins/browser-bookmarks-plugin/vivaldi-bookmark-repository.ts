import { Browser } from "./browser";
import { IconType } from "../../../common/icon/icon-type";
import { Icon } from "../../../common/icon/icon";
import { GoogleChromeBookmarkRepository } from "./google-chrome-bookmark-repository";

export class VivaldiBookmarkRepository extends GoogleChromeBookmarkRepository {
    public browser = Browser.Vivaldi;
    public defaultIcon: Icon = {
        parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m17.6 22.4c-.3.6-.9.9-1.5.9-.7.1-1.2-.3-1.6-.9l-5.3-9c-.7-1.2.2-2.6 1.5-2.7.7 0 1.2.3 1.6.9l2.5 4.3c.5.9 1.3 1.3 2.3 1.4 1.4.1 2.7-.9 2.9-2.4v-.3c0-.5-.1-.9-.3-1.3-.5-1.1 0-2.2 1.2-2.5.9-.2 2 .4 2.1 1.4.1.4 0 .8-.1 1z"/><path d="m16 2c-6 0-9.6 0-11.8 2.2s-2.2 5.8-2.2 11.8 0 9.6 2.2 11.8c1.7 1.7 4.2 2.1 8 2.2l-4.1-7c-1.7-1.9-2.6-4.4-2.6-7 0-5.8 4.7-10.5 10.5-10.5 4.3 0 8.2 2.7 9.8 6.7l4.2 7.2c0-1.1 0-2.1 0-3.4 0-6 0-9.6-2.2-11.8s-5.8-2.2-11.8-2.2z" opacity=".9"/><path d="m25.8 12.2c.5 1.2.7 2.5.7 3.8 0 5.8-4.7 10.5-10.5 10.5-3 0-5.9-1.2-7.9-3.5l4.1 7h3.8c6 0 9.6 0 11.8-2.2 1.8-1.8 2.1-4.4 2.2-8.4z"/></svg>`,
        type: IconType.SVG,
    };
}
