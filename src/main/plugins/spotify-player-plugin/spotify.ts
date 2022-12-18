import { BrowserWindow } from "electron";

const SpotifyWebApi = require('spotify-web-api-node');

import { SpotifyOptions, Device } from "../../../common/config/spotify-options";
import { SpotifyItem } from "../spotify-player-plugin/spotify-data";
import * as crypto from "crypto";


const SCOPES = ['user-read-playback-state', 'user-modify-playback-state'];


const spotifyApi = new SpotifyWebApi();




export class Spotify {
    /**
    An utility class to interact with Spotify API
    **/
    public static initAPI(config: SpotifyOptions) {
        spotifyApi.setClientId(config.client_id);
        spotifyApi.setClientSecret(config.client_secret);
        spotifyApi.setRedirectURI(config.redirect_uri);
    }

    public static authorize(config: SpotifyOptions): Promise<void> {
        const authWindow = new BrowserWindow({ width: 800, height: 1500 })
        return new Promise<void>((resolve, reject) => {
            let secret_code = crypto.randomBytes(8).toString('hex');
            let authorizeURL = spotifyApi.createAuthorizeURL(SCOPES, secret_code, true);
            authWindow.loadURL(authorizeURL);

            authWindow.webContents.on("will-navigate", function (event, newUrl) {
                let paramString = newUrl.split('?')[1];
                let queryString = new URLSearchParams(paramString);
                let code = queryString.get('code');
                let state = queryString.get('state');
                console.log("code ", code, "state ", state);

                spotifyApi.authorizationCodeGrant(code).then((data: any) => {
                    config.access_token = data.body['access_token'];
                    config.refresh_token = data.body['refresh_token'];
                    Spotify.setTokens(config.access_token!, config.refresh_token!);
                    config.isLoggedIn = true;
                    resolve();
                }).catch((err: any) => reject());

            })
        }).finally(() => authWindow.close());
    }

    public static setTokens(access_token: string, refresh_token: string) {
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
    }

    public static getTracks(song: string, config: SpotifyOptions, retry: boolean = true): Promise<SpotifyItem[]> {
        return new Promise((resolve, reject) => {
            const result: SpotifyItem[] = [];

            spotifyApi.searchTracks(song)
                .then((data: any) => {
                    for (let album of data.body.tracks.items) {
                        const spotifyItem: SpotifyItem = {
                            name: album.name,
                            external_url: album.external_url,
                            uri: album.uri,
                            icon_url: album.album.images[2].url,
                            artists: album.artists[0].name
                        }
                        result.push(spotifyItem);
                    }
                    resolve(result)
                })
                .catch((error: any) => {
                    if (retry == false) {
                        reject(error);
                    }
                    //access_token might've expired. Refresh the token and try again.
                    spotifyApi.refreshAccessToken().then((data: any) => {
                        config.access_token = data.body['access_token'];
                        spotifyApi.setAccessToken(data.body['access_token']);
                        resolve(Spotify.getTracks(song, config, false));
                    }).catch((error: any) => {
                        console.log("error while refreshing access_token: ", error);
                        reject(error);
                    })
                });
        });
    }

    public static playTrack(song_uri: string, device_id: string) {
        spotifyApi.play({ 'device_id': device_id, 'uris': [song_uri] }).catch((error: any) => console.log(error));
    }

    public static getDevices(): Promise<Device[]> {
        return new Promise<Device[]>((resolve, reject) => {
            spotifyApi.getMyDevices().then((data: any) => {
                let availableDevices = data.body.devices;
                const result: Device[] = [];
                availableDevices.forEach((data: any) => {
                    let device = { id: data.id, name: data.name };
                    result.push(device);
                })
                resolve(result);
            })
            .catch((err: any) => reject(err));
        })
    }
}