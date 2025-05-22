"use client";
import { IoSearchSharp } from "react-icons/io5";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "@/app/auth/auth-methods";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { authClient } from "@/lib/auth-client";
export default function userHeader() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
        router.push('/auth');
    };
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()
    if (session?.user) {
        console.log('User is logged in', session.user)
    } else {
        console.log('User is not logged in')
    }
    return (
        <header className="bg-background p-4 rounded-b-3xl flex items-center justify-between ">
            <div className="flex items-center space-x-8">
                {/* Logo */}
                <div className="w-8 h-8 rounded-full flex">
                    <span className='rounded-l-full h-full w-1/2 bg-foreground'></span>
                    <span className='scale-112 rounded-r-full h-full w-1/2 bg-primary'></span>
                </div>
                <div className="text-4xl font-bold text-foreground">Con<span className="text-primary">Cat</span></div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center gap-12 relative">
                <nav className="flex space-x-12 text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Home</Link>
                    <Link href="/settings" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Settings</Link>
                    <Link href="/help" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Help</Link>
                </nav>

                {/* Search Box */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search Reports"
                        className="bg-input text-foreground placeholder-muted-foreground rounded-full py-3 pl-10 pr-10 w-96 focus:outline-none"
                    />
                    <IoSearchSharp size={20} className="absolute  right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>

                {/* Profile Icon */}
                <div>
                    <div onClick={() => setOpen(!open)} className='w-12 h-12 text-white flex items-center justify-center cursor-pointer bg-accent rounded-full text-2xl font-semibold'>B</div>
                    {open && (
                        <div className="absolute border border-muted-foreground right-0 top-15 w-48 bg-background rounded-md shadow-lg">
                            <div className="p-2">
                                <button className="w-full text-left text-sm text-foreground hover:text-primary transition-all duration-200 " onClick={handleLogout}>
                                    {loading ?
                                        <div className="flex items-center justify-start">
                                            <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="var(--primary)" />
                                            <span className="ml-2 text-foreground">Logging out...</span>
                                        </div>
                                        : 'Logout'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </header>
    );
}
