
export interface Device {
    id: string,
    name: string,
}

export interface SpotifyOptions {
    isEnabled: boolean;
    isLoggedIn: boolean;
    prefix: string;
    access_token: string | null;
    refresh_token: string | null;
    available_devices: Device[];
    default_device: Device | null;
    client_id: string;
    client_secret: string;
    redirect_uri: string
}

export const defaultSpotifyOptions: SpotifyOptions = {
    isEnabled: true,
    isLoggedIn: false,
    prefix: "sp?",
    access_token: null,
    refresh_token: null,
    default_device: null,
    available_devices: [],
    client_id: "",
    client_secret: "",
    redirect_uri: "http://localhost:6969"
};