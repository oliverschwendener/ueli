import axios, { AxiosError } from "axios";
import { Definition } from "./dictionary";

export class DictionarySearcher {
    public static search(word: string): Promise<Definition[]> {
        return new Promise((resolve, reject) => {
            axios.get(`https://googledictionaryapi.eu-gb.mybluemix.net/?define=${word}&lang=en`)
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
}
