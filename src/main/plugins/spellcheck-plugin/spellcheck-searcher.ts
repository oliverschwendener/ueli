import axios, { AxiosError } from "axios";

export class SpellcheckSearcher {
    public static search(word: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // encodeURIComponent escape cyrillic chars
            const requestUrl = encodeURI(`https://speller.yandex.net/services/spellservice.json/checkText?text=${word}&lang=ru,en,uk`);

            axios.get(requestUrl)
                .then((response) => {
                    const definitions: any[] = response.data;
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
