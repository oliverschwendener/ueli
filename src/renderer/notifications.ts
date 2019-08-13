import { NotificationType } from "../common/notification-type";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

export function showNotification(message: string, notificationType: NotificationType) {
    vueEventDispatcher.$emit(VueEventChannels.notification, message, notificationType);
}
