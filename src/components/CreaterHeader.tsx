import { IoSearchSharp } from "react-icons/io5";
import Link from 'next/link';

export default function CreaterHeader() {
    return (
        <header className="bg-background px-4 py-2 rounded-b-2xl flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="w-6 h-6 rounded-full flex">
                    <span className='rounded-l-full h-full w-1/2 bg-foreground'></span>
                    <span className='scale-112 rounded-r-full h-full w-1/2 bg-primary'></span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                    Con<span className="text-primary">Cat</span>
                </div>
            </div>

            {/* Search + Nav + Avatar */}
            <div className="flex items-center gap-6">
                <nav className="flex space-x-6 text-sm font-medium">
                    <Link href="/creater" className="text-muted-foreground hover:text-primary transition-all duration-200">Home</Link>
                    <Link href="/settings" className="text-muted-foreground hover:text-primary transition-all duration-200">Settings</Link>
                    <Link href="/help" className="text-muted-foreground hover:text-primary transition-all duration-200">Help</Link>
                </nav>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search Reports"
                        className="bg-input text-foreground placeholder-muted-foreground rounded-full py-1.5 pl-8 pr-8 w-64 text-sm focus:outline-none"
                    />
                    <IoSearchSharp size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>
                <div className='w-9 h-9 text-white flex items-center justify-center cursor-pointer bg-accent rounded-full text-lg font-semibold'>B</div>
            </div>
        </header>
    );
}
