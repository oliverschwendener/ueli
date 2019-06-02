import axios from "axios";

interface WordType {
    pos: string;
}

interface Translation {
    text: string;
    word_type: WordType;
}

interface ExactMatch {
    translations: Translation[];
}

interface TranslationResponse {
    exact_matches?: ExactMatch[];
}

export class LingueeTranslator {
    public static async getTranslations(url: string): Promise<Translation[]> {
        try {
            const data = (await axios.get(url)).data as TranslationResponse;
            let translations: Translation[] = [];
            if (data.exact_matches) {
                translations = data.exact_matches
                    .map((exactMatch) => exactMatch.translations)
                    .flat();
                return translations;
            }
            return translations;
        } catch (error) {
            return error;
        }
    }
}
