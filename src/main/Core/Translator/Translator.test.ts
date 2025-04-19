import type { SettingsManager } from "@Core/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { Translator } from "./Translator";

describe(Translator, () => {
    it("should be able to translate stuff", () => {
        const getValueMock = vi.fn().mockReturnValue("en-US");
        const settingsManager = <SettingsManager>{ getValue: (v, d) => getValueMock(v, d) };

        const translator = new Translator(settingsManager);

        const { t } = translator.createT({
            "en-US": { message: "Hello" },
            "de-CH": { message: "Hoi", otherMessage: "Es anders hoi" },
            "ja-JP": { message: "ようこそ" },
            "ko-KR": { message: "안녕하세요" },
        });

        expect(t("message")).toBe("Hello");
        expect(t("otherMessage")).toBe("otherMessage");
    });

    it("should be able to interpolate", () => {
        const getValueMock = vi.fn().mockReturnValue("en-US");
        const settingsManager = <SettingsManager>{ getValue: (v, d) => getValueMock(v, d) };

        const translator = new Translator(settingsManager);

        const { t } = translator.createT({
            "en-US": { greeting: "Hello {{name}}" },
        });

        expect(t("greeting", { name: "Darth Vader" })).toBe("Hello Darth Vader");
    });
});
