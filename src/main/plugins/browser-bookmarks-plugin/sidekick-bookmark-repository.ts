import { Browser } from "./browser";
import { IconType } from "../../../common/icon/icon-type";
import { Icon } from "../../../common/icon/icon";
import { GoogleChromeBookmarkRepository } from "./google-chrome-bookmark-repository";

export class SideKickBookmarkRepository extends GoogleChromeBookmarkRepository {
    public browser = Browser.SideKick;
    public defaultIcon: Icon = {
        parameter: `<svg  viewBox="0 0 49 104" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48.825 0V25.8557L24.5039 12.924L48.825 0Z" fill="#FDCC53"/><path d="M48.825 25.8558L24.5039 38.7797V12.924L48.825 25.8558Z" fill="#F1684B"/><path d="M24.504 12.924V38.7797L0.175171 25.8558L24.504 12.924Z" fill="#4F2F8D"/><path d="M24.504 90.4832L0.175171 103.407V77.5515L24.504 90.4832Z" fill="#4F2F8D"/><path d="M48.825 51.7037V77.5516L24.5039 64.6276L48.825 51.7037Z" fill="#8D3F42"/><path d="M24.504 38.7797V64.6276H24.4962L0.175171 51.7036L24.504 38.7797Z" fill="#F1684B"/><path d="M48.825 77.5516L24.5039 90.4833V64.6276L48.825 77.5516Z" fill="#EC232E"/><path d="M24.504 64.6276V90.4833L0.175171 77.5516L24.4962 64.6276H24.504Z" fill="#B62078"/><path d="M48.825 51.7036L24.5039 64.6276V38.7797L48.825 51.7036Z" fill="#EC232F"/><path d="M24.504 38.7796L0.175171 51.7036V25.8557L24.504 38.7796Z" fill="#EE3730"/></svg>`,
        type: IconType.SVG,
    };
}
