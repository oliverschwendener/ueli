import { join, basename, extname } from "path";
import { createHash } from "crypto";
import { ueliTempFolder } from "../../../common/helpers/ueli-helpers";
import { replaceWhitespace } from "../../../common/helpers/string-helpers";

export const applicationIconLocation = join(ueliTempFolder, "application-icons");
export const powershellScriptFilePath = join(ueliTempFolder, "generate-icons.ps1");

export function getApplicationIconFilePath(applicationFilePath: string): string {
    const hash = createHash("md5").update(`${applicationFilePath}`).digest("hex");
    const fileName = `${replaceWhitespace(
        basename(applicationFilePath).replace(extname(applicationFilePath), "").toLowerCase(),
        "-",
    )}-${hash}`;
    return `${join(applicationIconLocation, fileName)}.png`;
}
