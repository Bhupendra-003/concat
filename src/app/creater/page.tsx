import React from 'react'
import CreateContestForm from '@/components/CreateContestForm'
import Header from '@/components/Header'

function page() {
    return (
        <div className="bg-background px-24 pt-4">
            <Header />
            <CreateContestForm />   
        </div>
    )
}

export default page
