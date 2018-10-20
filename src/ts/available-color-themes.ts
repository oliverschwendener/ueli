import { readdirSync } from "fs";
import { join } from "path";

const files = readdirSync(join(__dirname, "..", "styles"));

const colorThemes = files.filter((file: string): boolean => {
    return file !== "app.css";
});

export const availableColorThemes = colorThemes.map((colorTheme: string): string => {
    return colorTheme.replace(".css", "");
}).sort();
