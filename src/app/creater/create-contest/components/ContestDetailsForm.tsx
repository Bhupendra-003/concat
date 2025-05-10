import React from 'react';
import { AlertCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContestDetails, ValidationErrors, validateContestDetails } from '../validation';

interface ContestDetailsFormProps {
    contestDetails: ContestDetails;
    setContestDetails: React.Dispatch<React.SetStateAction<ContestDetails>>;
    validationErrors: ValidationErrors;
    setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
}

const ContestDetailsForm: React.FC<ContestDetailsFormProps> = ({
    contestDetails,
    setContestDetails,
    validationErrors,
    setValidationErrors
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2">
                <label className="text-muted-foreground text-sm">
                    Contest Name
                </label>
                <input
                    type="text"
                    value={contestDetails.name}
                    onChange={(e) =>
                        setContestDetails({
                            ...contestDetails,
                            name: e.target.value,
                        })
                    }
                    placeholder="Weekly Contest 1"
                    className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.contestDetails?.name ? 'border border-red-500' : ''}`}
                />
                {validationErrors.contestDetails?.name && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {validationErrors.contestDetails.name}
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <div className="flex flex-1 flex-col items-start gap-2">
                    <label className="text-muted-foreground text-sm">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        value={contestDetails.startTime}
                        onChange={(e) =>
                            setContestDetails({
                                ...contestDetails,
                                startTime: e.target.value,
                            })
                        }
                        className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.contestDetails?.startTime ? 'border border-red-500' : ''}`}
                    />
                    {validationErrors.contestDetails?.startTime && (
                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            {validationErrors.contestDetails.startTime}
                        </div>
                    )}
                </div>
                <div className="relative flex flex-col items-start gap-2">
                    <label className="text-muted-foreground text-sm">
                        Duration (in mins)
                    </label>
                    <input
                        type="number"
                        value={contestDetails.duration}
                        onChange={(e) =>
                            setContestDetails({
                                ...contestDetails,
                                duration: e.target.value,
                            })
                        }
                        placeholder="60"
                        className={`bg-input outline-none w-64 pl-10 text-sm rounded-md py-2 px-4 ${validationErrors.contestDetails?.duration ? 'border border-red-500' : ''}`}
                    />
                    <Timer className="size-5 text-muted-foreground absolute top-[55%] left-2" />
                    {validationErrors.contestDetails?.duration && (
                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            {validationErrors.contestDetails.duration}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-start gap-2">
                <label className="text-muted-foreground text-sm">
                    Max Participants
                </label>
                <input
                    type="number"
                    value={contestDetails.maxParticipants}
                    onChange={(e) =>
                        setContestDetails({
                            ...contestDetails,
                            maxParticipants: e.target.value,
                        })
                    }
                    placeholder="100"
                    className={`bg-input outline-none text-sm rounded-md py-2 px-4 w-full ${validationErrors.contestDetails?.maxParticipants ? 'border border-red-500' : ''}`}
                />
                {validationErrors.contestDetails?.maxParticipants && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {validationErrors.contestDetails.maxParticipants}
                    </div>
                )}
            </div>
            {validationErrors.contestDetails?.problems && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    {validationErrors.contestDetails.problems}
                </div>
            )}
            <Button
                onClick={() => validateContestDetails(contestDetails, setValidationErrors)}
                className="w-fit bg-accent ring/50 hover:ring-0 mt-8"
            >
                Continue
            </Button>
        </div>
    );
};

export default ContestDetailsForm;
