import { SettingsNotificationType } from "./settings-notification-type";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";

export function showNotification(message: string, notificationType: SettingsNotificationType) {
    vueEventDispatcher.$emit(VueEventChannels.notification, message, notificationType);
}
