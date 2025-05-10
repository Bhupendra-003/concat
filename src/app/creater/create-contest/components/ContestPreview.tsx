import React from 'react';
import { ContestDetails, Problem } from '../validation';
import ProblemList from './ProblemList';

interface ContestPreviewProps {
    contestDetails: ContestDetails;
    onEditProblem: (problem: Problem) => void;
    onDeleteProblem: (lcid: number) => void;
}

const ContestPreview: React.FC<ContestPreviewProps> = ({
    contestDetails,
    onEditProblem,
    onDeleteProblem
}) => {
    return (
        <div className="h-[90%] mt-6 rounded-2xl border border-gray-700 bg-[#1a1a1a] p-6 text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Contest Preview</h2>
            <div className="space-y-2 text-sm">
                <div className="bg-background w-full h-64 rounded-md border border-gray-600 flex flex-col p-4 text-gray-500">
                    <h1 className="text-lg text-white font-semibold mb-2">Details</h1>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <p className="text-white">
                            <span className="text-muted-foreground font-medium">Name:</span>{' '}
                            {contestDetails.name || ''}
                        </p>
                        <p className="text-white">
                            <span className="text-muted-foreground font-medium">
                                Start Time:
                            </span>{' '}
                            {contestDetails.startTime || ''}
                        </p>
                        <p className="text-white">
                            <span className="text-muted-foreground font-medium">Duration:</span>{' '}
                            {contestDetails.duration || 0} mins
                        </p>
                        <p className="text-white">
                            <span className="text-muted-foreground font-medium">
                                Max Participants:
                            </span>{' '}
                            {contestDetails.maxParticipants || 0}
                        </p>
                        <p className="text-white">
                            <span className="text-muted-foreground font-medium">
                                Number of Problems:
                            </span>{' '}
                            {contestDetails.problems.length || 0}
                        </p>
                        <p className="text-white">
                            <span className="text-muted-foreground font-medium">
                                Visibility:
                            </span>{' '}
                            {contestDetails.visibility ? 'Public' : 'Private'}
                        </p>
                    </div>
                </div>
                <h1 className="text-lg text-white font-semibold my-5">Problems</h1>
                <ProblemList 
                    problems={contestDetails.problems} 
                    onEdit={onEditProblem} 
                    onDelete={onDeleteProblem} 
                />
            </div>
        </div>
    );
};

export default ContestPreview;
