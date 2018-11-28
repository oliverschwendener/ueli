import { createHash } from "crypto";

export class AppIconStoreHelpers {
    public static buildIconFileName(name: string): string {
        return createHash("md5").update(name).digest("hex");
    }
}
