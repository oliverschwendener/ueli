import { FakeIconStore } from "./fake-icon-store";
import { ApplicationIcon } from "../../ts/icon-service/application-icon";

describe(FakeIconStore.name, (): void => {
    it("should add icons", (): void => {
        const icon: ApplicationIcon = {
            PNGFilePath: "some-file-path",
            name: "some-app",
        };

        const store = new FakeIconStore();
        store.addIcon(icon);

        const actual = store.getIcon(icon.name);
        expect(actual).not.toBe(undefined);
    });

    it("should return undefined when getting a non existent icon", (): void => {
        const store = new FakeIconStore();
        const actual = store.getIcon("some-icon");
        expect(actual).toBe(undefined);
    });
});
