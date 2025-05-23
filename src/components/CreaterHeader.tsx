"use client";
import { IoSearchSharp } from "react-icons/io5";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "@/app/auth/auth-methods";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { authClient } from "@/lib/auth-client";

export default function CreaterHeader() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    // Get user data
    const user = session?.user;

    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
        router.push('/auth');
    };

    return (
        <header className="bg-background px-4 py-4 rounded-b-2xl flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="w-8 h-8 rounded-full flex">
                    <span className='rounded-l-full h-full w-1/2 bg-foreground'></span>
                    <span className='scale-112 rounded-r-full h-full w-1/2 bg-primary'></span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                    Con<span className="text-primary">Cat</span>
                </div>
                {/* Creator Name */}
                {user && (
                    <div className="ml-4 px-3 py-1 bg-accent/20 rounded-full">
                        <span className="text-sm font-medium text-foreground">Creator: {user.name}</span>
                    </div>
                )}
            </div>

            {/* Search + Nav + Avatar */}
            <div className="flex items-center gap-6">
                <nav className="flex space-x-6 text-sm font-medium">
                    <Link href="/creater" className="text-muted-foreground hover:text-primary transition-all duration-200">Dashboard</Link>
                    <Link href="/creater/create-contest" className="text-muted-foreground hover:text-primary transition-all duration-200">Create Contest</Link>
                    <Link href="/settings" className="text-muted-foreground hover:text-primary transition-all duration-200">Settings</Link>
                </nav>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search Contests"
                        className="bg-input text-foreground placeholder-muted-foreground rounded-full py-1.5 pl-8 pr-8 w-64 text-sm focus:outline-none"
                    />
                    <IoSearchSharp size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>

                {/* Profile Icon */}
                <div>
                    <div
                        onClick={() => setOpen(!open)}
                        className='w-10 h-10 text-white flex items-center justify-center cursor-pointer bg-accent rounded-full text-lg font-semibold overflow-hidden'
                    >
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name || 'Creator'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span>{user?.name?.charAt(0).toUpperCase() || 'C'}</span>
                        )}
                    </div>
                    {open && (
                        <div className="absolute border border-muted-foreground right-0 top-15 w-64 bg-background rounded-md shadow-lg z-50">
                            {user && (
                                <div className="p-3 border-b border-muted-foreground">
                                    <p className="font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            )}
                            <div className="p-2">
                                <Link href="/profile" className="block w-full text-left p-2 text-sm text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-all duration-200">
                                    Profile
                                </Link>
                                <button
                                    className="w-full text-left p-2 text-sm text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-all duration-200"
                                    onClick={handleLogout}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-start">
                                            <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="var(--primary)" />
                                            <span className="ml-2 text-foreground">Logging out...</span>
                                        </div>
                                    ) : 'Logout'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
