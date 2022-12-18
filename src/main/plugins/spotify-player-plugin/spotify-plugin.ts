import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SpotifyOptions } from "../../../common/config/spotify-options";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import {Spotify}  from "./spotify";
import { IconType } from "../../../common/icon/icon-type";

export class SpotifyPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.Spotify;
    private config: SpotifyOptions;
    // @ts-ignore
    private translationSet: TranslationSet;


    constructor(    
        config: UserConfigOptions,
        translationSet: TranslationSet,
        clipboardCopier: (value: string) => Promise<void>,
    ) {
        this.config = config.spotifyOptions;
       
        this.translationSet = translationSet;
        this.config.isEnabled = true;
        Spotify.initAPI(this.config);
        Spotify.setTokens(this.config.access_token!, this.config.refresh_token!);
    }
    public isValidUserInput(userInput: string){
        return userInput.startsWith(this.config.prefix);
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        
        return new Promise((resolve, reject) => {
            const query = userInput.replace(this.config.prefix, "");
            if (this.config.access_token == null || (this.config.access_token.length < 1 )){
                Spotify.authorize(this.config);                
            }
            if (query.length > 0){
                Spotify.getTracks(query, this.config)
                    .then((spotifyItems)=>{
                        const result: SearchResultItem[] = [];
                        spotifyItems.forEach((item) => {
                            result.push({
                                description: item.artists,
                                executionArgument: item.uri,
                                hideMainWindowAfterExecution: true,
                                icon: {parameter: item.icon_url, type: IconType.URL},
                                name: item.name,
                                originPluginType: this.pluginType,
                                searchable: [], 
                            })
                        })
                        resolve(result);
                    })
                    .catch((error) => reject(error));
            }
            else { 
                resolve([]);
            }
        })  
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        Spotify.playTrack(searchResultItem.executionArgument, this.config.default_device!.id);
        return Promise.resolve();
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.spotifyOptions;
        this.translationSet = translationSet;
        return Promise.resolve();
    }

    
}