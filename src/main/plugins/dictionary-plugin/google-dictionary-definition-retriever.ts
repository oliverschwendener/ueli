import axios, { AxiosError } from "axios";
import { Definition } from "./dictionary";

export function getGoogleDictionaryDefinitions(word: string): Promise<Definition[]> {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://api.dictionaryapi.dev/api/v1/entries/en/${word}`)
            .then((response) => {
                const definitions: Definition[] = response.data;
                resolve(definitions);
            })
            .catch((err: AxiosError) => {
                if (err && err.response && err.response.status && err.response.status === 404) {
                    resolve([]);
                }
                reject(err.message);
            });
    });
}
