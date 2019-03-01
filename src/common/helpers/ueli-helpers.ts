import { join } from "path";
import { homedir } from "os";

export const ueliTempFolder: string = join(homedir(), ".ueli");
