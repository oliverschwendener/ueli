import axios from "axios";

interface Translation {
    text: string;
    pos: string;
}

interface Lemma {
    translations: Translation[];
}

export class LingueeTranslator {
    public static getTranslations(url: string): Promise<Translation[]> {
        return new Promise((resolve, reject) => {
            axios
                .get<Lemma[]>(url)
                .then((response) => resolve(response.data?.flatMap((l) => l.translations) ?? []))
                .catch((err) => reject(err));
        });
    }
}
