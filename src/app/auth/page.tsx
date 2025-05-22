"use client"

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, User } from 'lucide-react';
import { signUp, signIn, googleSignIn } from './auth-methods';
import { Ring2 } from 'ldrs/react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loading from '@/components/Loading';
import 'ldrs/react/Ring2.css';
import { toast } from 'react-hot-toast';
import { getLeetCodeUserProfile } from '@/actions/actionLeetQuery';
import db from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
export default function AuthForm() {
    const router = useRouter();
    const [view, setView] = useState<'signup' | 'signin' | 'verify' | 'leetcode' | 'leetcode-confirm'>('signup');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [leetcodeUsername, setLeetcodeUsername] = useState<string>('');
    const [leetcodeUserData, setLeetcodeUserData] = useState<any>(null);
    const [sessionLoading, setSessionLoading] = useState(true); // default true
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            setSessionLoading(true);
            const { data: session, error: sessionError } = await authClient.getSession();
            if (session?.user) {
                router.push('/user');
            } else {
                setSessionLoading(false); // session checked, no user
            }
        };
        checkSession();
    }, [router]);

    const updateLeetcodeUsername = async () => {
        await db.update(user).
        set({username: leetcodeUsername})
        .where(eq(user.email, email));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (view === 'signup') {
            // Move to LeetCode username input view
            setView('leetcode');
            setLoading(false);
        } else if (view === 'leetcode') {
            try {
                // Fetch LeetCode user profile data
                const profileData = await getLeetCodeUserProfile(leetcodeUsername);
                if (profileData) {
                    setLeetcodeUserData(profileData);
                    // Use the real name from LeetCode profile
                    setName(profileData.realName || leetcodeUsername);
                    setView('leetcode-confirm');
                } else {
                    toast.error('No LeetCode data found for this username');
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch LeetCode data');
                setError(error.message);
            }
            setLoading(false);
        } else if (view === 'leetcode-confirm') {
            // Complete signup with LeetCode username and profile data
            console.log('Signing up... with email:', email, 'and LeetCode username:', leetcodeUsername);
            const userAvatar = leetcodeUserData?.userAvatar || "";
            toast.promise(signUp(email, password, name, userAvatar), {
                loading: 'Signing up...',
                success: 'Signed up successfully',
                error: 'Failed to sign up'
            }).then((data) => {
                console.log('User Created with data:', data);
                updateLeetcodeUsername()
            }).catch((error: any) => {
                setError(error.message);
                console.error('Failed to sign up:', error);
            });
            setLoading(false);
        } else if (view === 'signin') {
            console.log('Signing in... with email:', email);
            toast.promise(signIn(email, password), {
                loading: 'Signing in...',
                success: 'Signed in successfully',
                error: 'Failed to sign in'
            }).then(() => {
                router.push('/user');
            }).catch((error: any) => {
                setError(error.message);
            });
            setLoading(false);
        }
    };

    const resendEmail = async () => {
        console.log('Resending verification email...');
        setLoading(true);
        await authClient.sendVerificationEmail({
            email: email,
            callbackURL: "/dashboard",
        });
        setLoading(false);
        console.log('Verification email resent');
    };
    // 🌟 Show loading spinner while checking session
    if (sessionLoading) {
        return <Loading />;
    }

    // 🌟 Otherwise show the auth form
    return (
        <div className="flex min-h-screen flex-col bg-background text-white">
            <h1 className="absolute top-8 left-20 text-center text-5xl font-bold">Con<span className="text-primary">Cat</span></h1>
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Sign Up View */}
                    {view === 'signup' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Sign up to Con<span className="text-primary">Cat</span>
                            </h1>
                            <div className="mb-6 text-center">
                                <span className="text-muted-foreground">Already have an account?</span>{' '}
                                <button onClick={() => setView('signin')} className="text-red-500 hover:underline">
                                    Sign in
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        console.log('Email changed to:', e.target.value);
                                        setEmail(e.target.value);
                                    }}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Email address"
                                    required
                                    autoComplete="email"
                                    spellCheck={false}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Password"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    {loading ? <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" /> : 'Sign up'}
                                </button>
                            </form>
                            <p className='text-center my-4'>Or</p>
                            <button className="w-full rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-white hover:text-black" onClick={googleSignIn}>
                                {loading ?
                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                : <div className='flex items-center justify-center gap-4'>
                                    <img className='w-5' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" alt="" />
                                    <span className="">Sign up with Google</span>
                                </div>}
                            </button>
                        </>
                    )}

                    {/* Sign In View */}
                    {view === 'signin' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Welcome to Con<span className="text-primary">Cat</span>
                            </h1>
                            <div className="mb-6 text-center">
                                <span className="text-muted-foreground">Don't have an account?</span>{' '}
                                <button onClick={() => setView('signup')} className="text-red-500 hover:underline">
                                    Sign up
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        console.log('Email changed to:', e.target.value);
                                        return setEmail(e.target.value);
                                    }}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Email address"
                                    required
                                    autoComplete="email"
                                    spellCheck={false}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Password"
                                    autoComplete="password"
                                    required
                                    spellCheck={false}
                                />
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    {loading ? <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" /> : 'Sign in'}
                                </button>

                            </form>
                            <p className='text-center my-4'>Or</p>
                            <button className="w-full rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-white hover:text-black" onClick={googleSignIn}>
                                {loading ?
                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                : <div className='flex items-center justify-center gap-4'>
                                    <img className='w-5' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" alt="" />
                                    <span className="">Sign in with Google</span>
                                </div>}
                            </button>
                        </>
                    )}

                    {/* LeetCode Username Input View */}
                    {view === 'leetcode' && (
                        <>
                            <h1 className="mb-4 text-center text-4xl font-bold">
                                Connect your LeetCode
                            </h1>
                            <div className="mb-8 text-center">
                                <span className="text-muted-foreground text-lg">This helps us verify your coding skills</span>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="leetcode-username" className="text-sm font-medium text-muted-foreground">LeetCode Username</label>
                                    <input
                                        type="text"
                                        id="leetcode-username"
                                        value={leetcodeUsername}
                                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                                        className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Your LeetCode username"
                                        required
                                        autoComplete="off"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        We'll fetch your profile details from LeetCode automatically
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                        disabled={loading}
                                    >
                                        {loading ?
                                            <div className="flex items-center justify-center">
                                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                                <span className="ml-2">Verifying...</span>
                                            </div>
                                            : 'Next'
                                        }
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setView('signup')}
                                        className="flex w-full items-center justify-center rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-accent/80"
                                        disabled={loading}
                                    >
                                        <ArrowLeft size={18} className="mr-2" />
                                        Back
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* LeetCode Confirmation View */}
                    {view === 'leetcode-confirm' && leetcodeUserData && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Confirm LeetCode Account
                            </h1>
                            <div className="mb-8 text-center">
                                <span className="text-muted-foreground text-lg">Is this your LeetCode account?</span>
                            </div>
                            <div className="mb-8 p-6 bg-accent/20 rounded-lg shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    {leetcodeUserData.userAvatar ? (
                                        <div className="relative w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center overflow-hidden">
                                            <div className="absolute">
                                                <Ring2
                                                    size="30"
                                                    stroke="3"
                                                    strokeLength="0.25"
                                                    bgOpacity="0.1"
                                                    speed="0.8"
                                                    color="var(--primary)"
                                                />
                                            </div>
                                            <img
                                                src={leetcodeUserData.userAvatar}
                                                alt={leetcodeUserData.username}
                                                className="w-full h-full object-cover rounded-full z-10"
                                                onLoad={(e) => {
                                                    // Hide the loader when image loads
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.opacity = "1";
                                                    // Hide the loader (previous sibling)
                                                    const loader = target.previousElementSibling;
                                                    if (loader) loader.classList.add("hidden");
                                                }}
                                                style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                                            <User className="text-primary" size={32} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-1">{leetcodeUserData.realName || leetcodeUserData.username}</h3>
                                        <p className="text-md text-muted-foreground mb-1">@{leetcodeUserData.username}</p>
                                        {leetcodeUserData.ranking && (
                                            <p className="text-sm text-primary font-medium">Ranking: {leetcodeUserData.ranking}</p>
                                        )}
                                    </div>
                                </div>

                                {leetcodeUserData.recentSubmissions && leetcodeUserData.recentSubmissions.length > 0 && (
                                    <div className="space-y-3 border-t border-accent/50 pt-4">
                                        <p className="text-sm font-medium text-muted-foreground">Recent submissions:</p>
                                        <ul className="space-y-3">
                                            {leetcodeUserData.recentSubmissions.slice(0, 3).map((submission: any, index: number) => (
                                                <li key={index} className="text-sm flex items-center gap-3 bg-accent/10 p-3 rounded-md">
                                                    <span
                                                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                                            submission.statusDisplay === 'Accepted'
                                                                ? 'bg-green-500'
                                                                : submission.statusDisplay === 'Wrong Answer'
                                                                    ? 'bg-red-500'
                                                                    : 'bg-yellow-500'
                                                        }`}
                                                    ></span>
                                                    <span className="font-medium flex-grow">{submission.title}</span>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {new Date(parseInt(submission.timestamp) * 1000).toLocaleDateString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                        disabled={loading}
                                    >
                                        {loading ?
                                            <div className="flex items-center justify-center">
                                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                                <span className="ml-2">Creating account...</span>
                                            </div>
                                            : 'Yes, this is me'
                                        }
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setView('leetcode')}
                                        className="flex w-full items-center justify-center rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-accent/80"
                                        disabled={loading}
                                    >
                                        <ArrowLeft size={18} className="mr-2" />
                                        Try a different username
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* Verification View */}
                    {view === 'verify' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">Verify your email</h1>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-center text-lg font-semibold">A verification email has been sent to <span className="text-blue-500">{email}</span> 🥳</h3>
                                <button
                                    type="button"
                                    onClick={resendEmail}
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    {loading ? <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" /> : 'Resend'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('signin')}
                                    className="flex w-full items-center justify-center rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-accent/80"
                                >
                                    <ArrowLeft size={18} className="mr-2" />
                                    Other sign in options
                                </button>
                                <div className="mt-6 text-center">
                                    <span className="text-gray-400">Didn't get the code?</span>{' '}
                                    <button type="button" className="text-primary hover:text-primary/80 underline">
                                        Send again
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
