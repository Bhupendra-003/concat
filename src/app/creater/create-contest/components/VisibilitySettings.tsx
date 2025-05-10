import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { ContestDetails } from '../validation';

interface VisibilitySettingsProps {
    contestDetails: ContestDetails;
    setContestDetails: React.Dispatch<React.SetStateAction<ContestDetails>>;
    createContest: () => Promise<void>;
}

const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({
    contestDetails,
    setContestDetails,
    createContest
}) => {
    return (
        <div className="relative w-fit py-8 px-15">
            <div className="flex items-start justify-between">
                <label className="text-foreground text-sm">Public</label>
                <Switch
                    checked={contestDetails.visibility}
                    onClick={() =>
                        setContestDetails({
                            ...contestDetails,
                            visibility: !contestDetails.visibility,
                        })
                    }
                />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
                Public contests are visible to all users and can be accessed by{' '}
                <span className="text-primary">anyone</span> with a link.
            </p>
            <Button
                onClick={createContest}
                className="w-fit bg-accent mt-8 absolute right-0"
            >
                Create Contest
            </Button>
        </div>
    );
};

export default VisibilitySettings;
