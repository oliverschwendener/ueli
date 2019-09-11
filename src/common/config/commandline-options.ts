export interface CommandlineOptions {
    isEnabled: boolean;
    prefix: string;
}

export const defaultCommandlineOptions: CommandlineOptions = {
    isEnabled: true,
    prefix: ">",
};
