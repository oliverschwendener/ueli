import { Button, Field, Input, Link, Text } from "@fluentui/react-components";
import { useState } from "react";

type MissingApiKeyProps = {
    onApiKeySet: (apiKey: string) => void;
    openSignUpWebsite: () => void;
};

export const MissingApiKey = ({ onApiKeySet, openSignUpWebsite }: MissingApiKeyProps) => {
    const [value, setValue] = useState<string>("");

    const saveApiKey = async () => {
        onApiKeySet(value);
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
            }}
        >
            <div style={{ width: 350 }}>
                <Text>
                    Login or sign up <Link onClick={openSignUpWebsite}>here</Link> to create an API key.
                </Text>
            </div>

            <Field label="Enter your DeepL API key" style={{ width: 350 }}>
                <Input width={"100%"} autoFocus value={value} onChange={(_, { value }) => setValue(value)} />
            </Field>

            <div style={{ paddingBottom: 25 }}>
                <Button onClick={() => saveApiKey()}>Continue</Button>
            </div>
        </div>
    );
};
