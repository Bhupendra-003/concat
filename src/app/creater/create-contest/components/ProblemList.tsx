import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PiMedalMilitaryBold } from "react-icons/pi";
import { Problem } from '../validation';

interface ProblemListProps {
    problems: Problem[];
    onEdit: (problem: Problem) => void;
    onDelete: (lcid: number) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, onEdit, onDelete }) => {
    return (
        <ul className="list-disc">
            {problems.map((p, index) => (
                <li key={index}
                    className="flex mb-2 items-center group bg-accent justify-between rounded-md py-2 px-4 gap-2"
                >
                    <p>{p.name}</p>
                    <div className="flex items-center gap-12 justify-between">
                        <div className="flex items-center gap-2 group-hover:opacity-100 transition-opacity duration-200 opacity-0">
                            <button
                                className='bg-accent p-2 transition-all duration-300 hover:bg-background rounded text-white'
                                onClick={() => {
                                    // Switch to Problems tab
                                    const problemsTab = document.querySelector('[value="Problems"]') as HTMLElement;
                                    if (problemsTab) problemsTab.click();
                                    // Start editing
                                    onEdit(p);
                                }}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                className='bg-accent p-2 transition-all duration-300 hover:bg-red-900/80 rounded'
                                onClick={() => onDelete(p.lcid)}
                            >
                                <Trash2 size={16} color='red' />
                            </button>
                        </div>
                        <a
                            className="px-3 py-1 border border-gray-600 rounded-md"
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Link
                        </a>
                        <span className="text-muted-foreground w-8">{p.difficulty}</span>
                        <div className="flex items-center text-muted-foreground">
                            <span className='mr-2'><PiMedalMilitaryBold /></span>
                            <span className='w-6'>{p.points}</span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProblemList;
