import {Notification} from "electron";
import {getCurrentOperatingSystem} from "../../common/helpers/operating-system-helpers"
import {OperatingSystem} from "../../common/operating-system"
import {join} from "path";
import { platform } from "os";


export function NotificationHelper(message:string) {
    new Notification( {
        title:"UELI",
        body:  message,
        icon:getCurrentOperatingSystem(platform())===OperatingSystem.Windows ? join(__dirname,'../img/icons/win/icon-transparent.ico') : '',
    }).show();
}