import { join } from "path";
import { homedir } from "os";

export const ueliTempDir = join(homedir(), ".ueli");
