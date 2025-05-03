"use client"

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { signUp, signIn} from './auth-methods';
import { Ring2 } from 'ldrs/react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loading from '@/components/Loading';
import 'ldrs/react/Ring2.css';
import { toast } from 'react-hot-toast';
export default function AuthForm() {
    const router = useRouter();
    const [view, setView] = useState<'signup' | 'signin' | 'verify'>('signup');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [sessionLoading, setSessionLoading] = useState(true); // default true
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            setSessionLoading(true);
            const { data: session, error: sessionError } = await authClient.getSession();
            if (session?.user) {
                router.push('/dashboard');
            } else {
                setSessionLoading(false); // session checked, no user
            }
        };
        checkSession();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (view === 'signup') {
            console.log('Signing up... with email:', email);
            toast.promise(signUp(email, password, "Bhupendra", ""), {
                loading: 'Signing up...',
                success: 'Signed up successfully',
                error: 'Failed to sign up'
            }).then((data) => {
                console.log('Signed up successfully with data:', data);
                router.push('/dashboard');
            }).catch((error: any) => {
                setError(error.message);
                console.error('Failed to sign up:', error);
            });
        } else if (view === 'signin') {
            console.log('Signing in... with email:', email);    
            toast.promise(signIn(email, password), {
                loading: 'Signing in...',
                success: 'Signed in successfully',
                error: 'Failed to sign in'
            }).then(() => {
                router.push('/dashboard');
            }).catch((error: any) => {
                setError(error.message);
            });
        }
        setLoading(false);
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
