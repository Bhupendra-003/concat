import React from 'react'
import { FiCheckCircle, FiX } from "react-icons/fi";
import { Button } from '../ui/button';
// import { Problem } from '@/db/types';

interface Problem {
    id: number;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    status: 'solved' | 'unsolved';
}

function Problems({ problems }: { problems: Problem[] }) {
    return (
        <div className="">
            {problems.map((problem) => (
                    <div key={problem.id} className={`${problem.id % 2 === 0 ? '' : 'bg-card'} rounded-lg grid grid-cols-4 w-full justify-between items-center gap-4 px-6 p-2`}>
                        <div className='flex items-center gap-4'>
                            {problem.status === 'solved' ? <div><FiCheckCircle size={20} color='#45ff00' /></div> : <div><FiX size={20} color='transparent' /></div>}
                            <h3 className="text-lg font-bold text-white">{problem.name}</h3>
                        </div>
                        <p className="w-4 text-md text-gray-300">{problem.difficulty}</p>
                        <p className=" text-md text-gray-300">{problem.points} points</p>
                        <Button className='w-24 ml-auto' variant="default" >{problem.status === 'solved' ? 'Solved' : 'Solve'}</Button>
                </div>
            ))}
        </div>
    )
}

export default Problems
