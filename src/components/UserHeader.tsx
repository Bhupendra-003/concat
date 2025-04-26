import { IoSearchSharp } from "react-icons/io5"; 
import Link from 'next/link';
export default function userHeader() {
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
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                        <span className='text-background text-2xl font-semibold'>B</span>
                    </div>
                </div>
            </div>

        </header>
    );
}
