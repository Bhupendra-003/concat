import React from 'react'
import CreaterHeader from '@/components/CreaterHeader'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { MdAdd } from "react-icons/md";
function page() {
    return (
        <div className="bg-background px-24 pt-4">
            <CreaterHeader />
            <div >
                <div className='flex justify-between items-center mb-4'>
                    <h1 className="text-4xl font-semibold mb-4 mt-8">Contests</h1>
                    <Button className="bg-primary text-foreground">
                        <MdAdd className='scale-130' color='white' /> 
                        Create New Contest</Button>
                </div>
                <hr />
                {/* Contest Card */}
                <div className='min-w-96 flex mt-8 justify-between flex-col p-6 w-fit h-64 bg-muted rounded-xl'>
                    <h1 className="text-2xl pb-2 font-semibold">Data Structures Sprint</h1>
                    <div className='flex gap-2 max-w-120 overflow-x-auto scroll-hide'>
                        <Badge className='text-black bg-color-3'>Array</Badge>
                        <Badge className='text-black bg-color-3'>Linked List</Badge>
                        <Badge className='text-black bg-color-3'>Stack</Badge>
                        <Badge className='text-black bg-color-3'>Array</Badge>
                        <Badge className='text-black bg-color-3'>Linked List</Badge>
                        <Badge className='text-black bg-color-3'>Stack</Badge>
                        <Badge className='text-black bg-color-3'>Array</Badge>
                        <Badge className='text-black bg-color-3'>Linked List</Badge>
                        <Badge className='text-black bg-color-3'>Stack</Badge>
                    </div>
                    <div className='flex w-full gap-4 justify-between'>
                        <div className="text-black w-full bg-color-1 rounded-xl p-2">Participants: 100</div>
                        <div className="text-black w-full bg-color-2 rounded-xl p-2">Starts in: 1h 30m</div>
                    </div>
                    <div className='w-full'>
                        <div className="text-white mb-4">Time Left</div>
                        <Progress value={33} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
