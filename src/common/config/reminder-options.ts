export interface ReminderOptions {
    isEnabled: boolean;
    prefix:string;
}

export const defaultReminderOptions: ReminderOptions = {
    isEnabled: true,
    prefix: "rmt?",
};
