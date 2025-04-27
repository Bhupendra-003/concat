// components/Loading.tsx
"use client";

import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-white">
            {/* Spinner */}
            <Ring2 size="50" stroke="3" strokeLength="0.25" bgOpacity="0.1" speed="0.8" color="white" />

            {/* Branding Text */}
            <h1 className="mt-6 text-2xl font-bold">
                <span className="text-primary">Con</span>Cat is Loading...
            </h1>

            {/* Optional small subtitle */}
            <p className="mt-2 text-sm text-muted-foreground">Please wait a moment 🚀</p>
        </div>
    );
}
