"use client"
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function AuthForm() {
    const [view, setView] = useState('signup'); // 'signup', 'signin', 'verify'
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For signup/signin, we'd typically send the email and password
        if (view === 'signup' || view === 'signin') {
            console.log(`${view === 'signup' ? 'Signing up' : 'Signing in'} with:`, { email, password });
            setView('verify');
        }
        // For verification, we'd verify the code
        else if (view === 'verify') {
            console.log('Verifying code:', verificationCode);
            // Verification logic would go here
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-white">
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Sign Up View */}
                    {view === 'signup' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">Sign up to Con<span className="text-primary">Cat</span></h1>
                            <div className="mb-6 text-center">
                                <span className="text-muted-foreground">Already have an account?</span>{' '}
                                <button
                                    onClick={() => setView('signin')}
                                    className="text-red-500 hover:underline"
                                >
                                    Sign in
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Email address"
                                    required
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Password"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    Continue
                                </button>
                            </form>
                        </>
                    )}

                    {/* Sign In View */}
                    {view === 'signin' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">Sign in to Con<span className="text-primary">Cat</span></h1>
                            <div className="mb-6 text-center">
                                <span className="text-muted-foreground">Don't have an account?</span>{' '}
                                <button
                                    onClick={() => setView('signup')}
                                    className="text-red-500 hover:underline"
                                >
                                    Sign up
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Email address"
                                    required
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Password"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    Sign in
                                </button>
                            </form>
                        </>
                    )}

                    {/* Verification View */}
                    {view === 'verify' && (
                        <>
                            <h1 className="mb-6 text-center text-4xl font-bold">Verify your email</h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full rounded-lg border bg-input p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Verification code"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/80"
                                >
                                    Verify
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
                                    <button
                                        type="button"
                                        className="text-primary hover:text-primary/80 underline"
                                    >
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