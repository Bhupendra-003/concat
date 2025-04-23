import { IoSearchSharp } from "react-icons/io5"; 
export default function Header() {
    return (
        <header className="bg-background p-4 rounded-b-3xl flex items-center justify-between ">
            <div className="flex items-center space-x-8">
                {/* Logo */}
                <div className="w-8 h-8 rounded-full flex">
                    <span className='rounded-l-full h-full w-1/2 bg-foreground'></span>
                    <span className='scale-112 rounded-r-full h-full w-1/2 bg-primary'></span>
                </div>

                {/* Navigation */}

            </div>

            {/* Search Box */}
            <div className="flex justify-between items-center gap-12 relative group">
                <nav className="flex space-x-12 text-sm">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Home</a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Settings</a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 font-semibold text-lg">Help</a>
                </nav>
                <input
                    type="text"
                    placeholder="Search Reports"
                    className="bg-input text-foreground placeholder-muted-foreground rounded-full py-3 pl-10 pr-10 w-96 focus:outline-none"
                />
                <IoSearchSharp size={20} className="absolute  right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>

        </header>
    );
}
