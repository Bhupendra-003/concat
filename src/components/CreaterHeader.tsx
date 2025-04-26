import { IoSearchSharp } from "react-icons/io5"; 
import Link from 'next/link';
export default function createrHeader() {
    return (
        <header className="bg-background p-4 rounded-b-3xl flex items-center justify-between ">
            <div className="flex items-center space-x-8">
                {/* Logo */}
                <div className="w-8 h-8 rounded-full flex">
                    <span className='rounded-l-full h-full w-1/2 bg-foreground'></span>
                    <span className='scale-112 rounded-r-full h-full w-1/2 bg-primary'></span>
                </div>
                <div className="text-4xl font-bold text-foreground">Con<span className="text-primary">Cat</span></div>

                {/* Navigation */}

            </div>

            {/* Search Box */}
            <div className="flex justify-between items-center gap-12 relative">
                <nav className="flex space-x-12 text-sm">
                    <Link href="/creater" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Home</Link>
                    <Link href="/settings" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Settings</Link>
                    <Link href="/help" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Help</Link>
                </nav>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search Reports"
                        className="bg-input text-foreground placeholder-muted-foreground rounded-full py-3 pl-10 pr-10 w-96 focus:outline-none"
                    />
                    <IoSearchSharp size={20} className="absolute  right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>  
            </div>

        </header>
    );
}
