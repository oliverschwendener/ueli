import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getWebearchSuggestions(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        axios
            .get(url, { headers: { "user-agent": "Mozilla/5.0" } })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });
}
