import React from "react";
import { Dropdown, Option } from "@fluentui/react-components";

interface ProfileSelectorProps {
    profiles: string[];
    selectedProfile: string;
    onProfileChange: (profile: string) => void;
    label?: string;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, selectedProfile, onProfileChange, label }) => (
    <div>
        {label && <label>{label}</label>}
        <Dropdown
            value={selectedProfile}
            selectedOptions={[selectedProfile]}
            onOptionSelect={(_, { optionValue }) => optionValue && onProfileChange(optionValue)}
        >
            {profiles.map((profile) => (
                <Option key={profile} value={profile}>
                    {profile}
                </Option>
            ))}
        </Dropdown>
    </div>
);
