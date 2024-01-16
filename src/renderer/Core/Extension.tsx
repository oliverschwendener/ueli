import { useParams } from "react-router";
import { getExtension } from "../Extensions";

export const Extension = () => {
    const extensionId = useParams().extensionId;

    if (!extensionId) {
        return <>Missing extension id</>;
    }

    return getExtension(extensionId)?.extension ?? <>Extension with id {extensionId} did not provide any UI</>;
};
