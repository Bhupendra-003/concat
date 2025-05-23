"use client"

import { useEffect, useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { signUp, signIn, googleSignIn } from './auth-methods';
import { Ring2 } from 'ldrs/react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loading from '@/components/Loading';
import 'ldrs/react/Ring2.css';
import { toast } from 'react-hot-toast';
import { getLeetCodeUserProfile } from '@/actions/actionLeetQuery';
import { updateUserLeetCodeUsername } from '@/actions/actionNeonDb';
export default function AuthForm() {
    const router = useRouter();
    // Combined state object for form data and UI state
    const [formState, setFormState] = useState({
        view: 'signup' as 'signup' | 'signin' | 'verify' | 'leetcode' | 'leetcode-confirm',
        email: '',
        password: '',
        name: '',
        leetcodeUsername: '',
        leetcodeUserData: null as any,
        sessionLoading: true, // default true
        loading: false,
        error: null as string | null
    });

    useEffect(() => {
        const checkSession = async () => {
            setFormState(prev => ({ ...prev, sessionLoading: true }));
            const { data: session } = await authClient.getSession();
            if (session?.user) {
                router.push('/user');
            } else {
                setFormState(prev => ({ ...prev, sessionLoading: false })); // session checked, no user
            }
        };
        checkSession();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState(prev => ({ ...prev, loading: true, error: null }));

        if (formState.view === 'signup') {
            // Move to LeetCode username input view
            setFormState(prev => ({ ...prev, view: 'leetcode', loading: false }));
        } else if (formState.view === 'leetcode') {
            try {
                // Fetch LeetCode user profile data
                const profileData = await getLeetCodeUserProfile(formState.leetcodeUsername);
                if (profileData) {
                    setFormState(prev => ({
                        ...prev,
                        leetcodeUserData: profileData,
                        name: profileData.realName || formState.leetcodeUsername,
                        view: 'leetcode-confirm'
                    }));
                } else {
                    toast.error('No LeetCode data found for this username');
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch LeetCode data');
                setFormState(prev => ({ ...prev, error: error.message }));
            }
            setFormState(prev => ({ ...prev, loading: false }));
        } else if (formState.view === 'leetcode-confirm') {
            // Complete signup with LeetCode username and profile data
            console.log('Signing up... with email:', formState.email, 'and LeetCode username:', formState.leetcodeUsername);
            const userAvatar = formState.leetcodeUserData?.userAvatar || "";
            toast.promise(signUp(formState.email, formState.password, formState.name, userAvatar), {
                loading: 'Signing up...',
                success: 'Signed up successfully',
                error: 'Failed to sign up'
            }).then((data) => {
                console.log('User Created with data:', data);
                updateUserLeetCodeUsername(formState.email, formState.leetcodeUsername);
                router.push('/user');
                localStorage.setItem('LeetcodeUsername', formState.leetcodeUsername);
                // Reset form state
                setFormState(prev => ({
                    ...prev,
                    loading: false,
                    view: 'signup',
                    email: '',
                    password: '',
                    name: '',
                    leetcodeUsername: '',
                    leetcodeUserData: null,
                    error: null
                }));
            }).catch((error: any) => {
                setFormState(prev => ({ ...prev, error: error.message }));
                console.error('Failed to sign up:', error);
            });
            setFormState(prev => ({ ...prev, loading: false }));
        } else if (formState.view === 'signin') {
            console.log('Signing in... with email:', formState.email);
            toast.promise(signIn(formState.email, formState.password), {
                loading: 'Signing in...',
                success: 'Signed in successfully',
                error: 'Failed to sign in'
            }).then(() => {
                router.push('/user');
            }).catch((error: any) => {
                setFormState(prev => ({ ...prev, error: error.message }));
            });
            setFormState(prev => ({ ...prev, loading: false }));
        }
    };

    const resendEmail = async () => {
        console.log('Resending verification email...');
        setFormState(prev => ({ ...prev, loading: true }));
        await authClient.sendVerificationEmail({
            email: formState.email,
            callbackURL: "/dashboard",
        });
        setFormState(prev => ({ ...prev, loading: false }));
        console.log('Verification email resent');
    };
    // 🌟 Show loading spinner while checking session
    if (formState.sessionLoading) {
        return <Loading />;
    }

    // 🌟 Otherwise show the auth form
    return (
        <div className="flex min-h-screen flex-col bg-background text-white">
            <h1 className="absolute top-8 left-20 text-center text-5xl font-bold">Con<span className="text-primary">Cat</span></h1>
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Sign Up View */}
                    {formState.view === 'signup' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Sign up to Con<span className="text-primary">Cat</span>
                            </h1>
                            <div className="mb-6 text-center">
                                <span className="text-muted-foreground">Already have an account?</span>{' '}
                                <button onClick={() => setFormState(prev => ({ ...prev, view: 'signin' }))} className="text-red-500 hover:underline">
                                    Sign in
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={formState.email}
                                    onChange={(e) => {
                                        console.log('Email changed to:', e.target.value);
                                        setFormState(prev => ({ ...prev, email: e.target.value }));
                                    }}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Email address"
                                    required
                                    autoComplete="email"
                                    spellCheck={false}
                                />
                                <input
                                    type="password"
                                    value={formState.password}
                                    onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Password"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    {formState.loading ? <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" /> : 'Continue'}
                                </button>
                            </form>
                            <p className='text-center my-4'>Or</p>
                            <button className="w-full rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-white hover:text-black" onClick={googleSignIn}>
                                {formState.loading ?
                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                : <div className='flex items-center justify-center gap-4'>
                                    <img className='w-5' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" alt="" />
                                    <span className="">Sign up with Google</span>
                                </div>}
                            </button>
                        </>
                    )}

                    {/* Sign In View */}
                    {formState.view === 'signin' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Welcome to Con<span className="text-primary">Cat</span>
                            </h1>
                            <div className="mb-6 text-center">
                                <span className="text-muted-foreground">Don't have an account?</span>{' '}
                                <button onClick={() => setFormState(prev => ({ ...prev, view: 'signup' }))} className="text-red-500 hover:underline">
                                    Sign up
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={formState.email}
                                    onChange={(e) => {
                                        console.log('Email changed to:', e.target.value);
                                        setFormState(prev => ({ ...prev, email: e.target.value }));
                                    }}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Email address"
                                    required
                                    autoComplete="email"
                                    spellCheck={false}
                                />
                                <input
                                    type="password"
                                    value={formState.password}
                                    onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
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
                                    {formState.loading ? <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" /> : 'Sign in'}
                                </button>

                            </form>
                            <p className='text-center my-4'>Or</p>
                            <button className="w-full rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-white hover:text-black" onClick={googleSignIn}>
                                {formState.loading ?
                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                : <div className='flex items-center justify-center gap-4'>
                                    <img className='w-5' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" alt="" />
                                    <span className="">Sign in with Google</span>
                                </div>}
                            </button>
                        </>
                    )}

                    {/* LeetCode Username Input View */}
                    {formState.view === 'leetcode' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Connect your LeetCode
                            </h1>
                            <div className="mb-8 text-center">
                                <span className="text-muted-foreground text-lg">This helps us finding you on LeetCode</span>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-3">
                                    <label htmlFor="leetcode-username" className="text-sm font-medium text-white">LeetCode Username</label>
                                    <input
                                        type="text"
                                        id="leetcode-username"
                                        value={formState.leetcodeUsername}
                                        onChange={(e) => setFormState(prev => ({ ...prev, leetcodeUsername: e.target.value }))}
                                        className="w-full rounded-lg border mt-1 bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Your LeetCode username"
                                        required
                                        autoComplete="off"
                                    />
                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                        We'll fetch your profile details from LeetCode automatically
                                    </p>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                        disabled={formState.loading}
                                    >
                                        {formState.loading ?
                                            <div className="flex items-center justify-center">
                                                <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />
                                                <span className="ml-2">Verifying...</span>
                                            </div>
                                            : 'Next'
                                        }
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setFormState(prev => ({ ...prev, view: 'signup' }))}
                                        className="flex w-full items-center justify-center rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-accent/80"
                                        disabled={formState.loading}
                                    >
                                        <ArrowLeft size={18} className="mr-2" />
                                        Back
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* LeetCode Confirmation View */}
                    {formState.view === 'leetcode-confirm' && formState.leetcodeUserData && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">
                                Confirm LeetCode Account
                            </h1>
                            <div className="mb-8 text-center">
                                <span className="text-muted-foreground text-lg">Is this your LeetCode account?</span>
                            </div>
                            <div className="mb-8 p-6 bg-accent/20 rounded-lg shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    {formState.leetcodeUserData.userAvatar ? (
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
                                                src={formState.leetcodeUserData.userAvatar}
                                                alt={formState.leetcodeUserData.username}
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
                                        <h3 className="text-2xl font-semibold mb-1">{formState.leetcodeUserData.realName || formState.leetcodeUserData.username}</h3>
                                        <p className="text-md text-muted-foreground mb-1">@{formState.leetcodeUserData.username}</p>
                                        {formState.leetcodeUserData.ranking && (
                                            <p className="text-sm text-primary font-medium">Ranking: {formState.leetcodeUserData.ranking}</p>
                                        )}
                                    </div>
                                </div>

                                {formState.leetcodeUserData.recentSubmissions && formState.leetcodeUserData.recentSubmissions.length > 0 && (
                                    <div className="space-y-3 border-t border-accent/50 pt-4">
                                        <p className="text-sm font-medium text-muted-foreground">Recent submissions:</p>
                                        <ul className="space-y-3">
                                            {formState.leetcodeUserData.recentSubmissions.slice(0, 3).map((submission: any, index: number) => (
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
                                        disabled={formState.loading}
                                    >
                                        {formState.loading ?
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
                                        onClick={() => setFormState(prev => ({ ...prev, view: 'leetcode' }))}
                                        className="flex w-full items-center justify-center rounded-lg bg-accent py-3 font-medium text-white transition-colors hover:bg-accent/80"
                                        disabled={formState.loading}
                                    >
                                        <ArrowLeft size={18} className="mr-2" />
                                        Try a different username
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* Verification View */}
                    {formState.view === 'verify' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">Verify your email</h1>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-center text-lg font-semibold">A verification email has been sent to <span className="text-blue-500">{formState.email}</span> 🥳</h3>
                                <button
                                    type="button"
                                    onClick={resendEmail}
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    {formState.loading ? <Ring2 size="20" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" /> : 'Resend'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormState(prev => ({ ...prev, view: 'signin' }))}
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
