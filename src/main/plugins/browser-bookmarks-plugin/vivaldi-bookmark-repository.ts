import { Browser } from "./browser";
import { IconType } from "../../../common/icon/icon-type";
import { Icon } from "../../../common/icon/icon";
import { GoogleChromeBookmarkRepository } from "./google-chrome-bookmark-repository";

export class VivaldiBookmarkRepository extends GoogleChromeBookmarkRepository {
    public browser = Browser.Vivaldi;
    public defaultIcon: Icon = {
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28"><defs><linearGradient gradientUnits="userSpaceOnUse" y2="28.804" y1="5.696" x2="22.495" x1="9.153" id="A"><stop offset="0%" stop-opacity=".2"/><stop offset="79.08%" stop-opacity=".05"/></linearGradient></defs><path d="M14.4 28.695c6.133 0 9.54 0 11.773-2.22 2.227-2.22 2.227-5.616 2.227-11.73s0-9.51-2.227-11.73C23.94.8 20.533.8 14.4.8S4.86.8 2.627 3.02C.4 5.24.4 8.637.4 14.75s0 9.5 2.227 11.73c2.233 2.214 5.64 2.214 11.773 2.214z" fill="#ef3939"/><path d="M23.504 9.6a10.48 10.48 0 0 0-6.409-4.927C11.5 3.168 5.733 6.477 4.232 12.057a10.37 10.37 0 0 0 1.076 7.978c.018.03.037.068.062.098l4.933 8.52c.818.025 1.704.03 2.657.03h1.4c2.725 0 4.915 0 6.705-.197 2.233-.246 3.832-.794 5.07-2.024 1.802-1.796 2.147-4.367 2.214-8.532z" fill="url(#A)"/><path d="M21.77 7.37a10.5 10.5 0 0 0-14.824 0 10.44 10.44 0 0 0 0 14.782 10.5 10.5 0 0 0 14.824 0c4.09-4.085 4.097-10.703 0-14.782zm-.628 4.804l-5.186 8.993c-.32.56-.788.892-1.427.94-.713.05-1.28-.252-1.642-.867l-5.24-9.085C6.98 10.998 7.733 9.59 9.06 9.52c.7-.037 1.242.29 1.6.898l2.497 4.312c.517.867 1.28 1.353 2.294 1.415 1.433.086 2.768-.953 2.94-2.473l.024-.283c-.006-.492-.1-.9-.295-1.298-.535-1.07.037-2.27 1.2-2.528.947-.2 1.93.486 2.055 1.446.06.412-.024.8-.233 1.163z" fill="#fff"/></svg>`,
        type: IconType.SVG,
    };
}
