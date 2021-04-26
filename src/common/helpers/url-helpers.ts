import { isValidEmailAddress } from "./email-helpers";

export function isValidUrl(url: string): boolean {
    const http = "http://";
    const https = "https://";
    const fullUrlRegex = new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]{2,}.*$/i, "gi");
    const stringStartsWithHttpOrHttps =
        (url.startsWith(http) && url.length > http.length) || (url.startsWith(https) && url.length > https.length);
    return (fullUrlRegex.test(url) || stringStartsWithHttpOrHttps) && !isValidEmailAddress(url);
}
