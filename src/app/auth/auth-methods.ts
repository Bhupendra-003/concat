"use client";
import { authClient } from "@/lib/auth-client"; //import the auth client
export const signUp = async (email: string, password: string, name: string, image: string = "") => {
    console.log('Signing up...');
    const { data, error } = await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name: name, // user display name
        image, // User image URL (optional)
        callbackURL: "/user", // A URL to redirect to after the user verifies their email (optional)
    });
    if (error) {
        throw error;
    }else{
        // After successful signup, update the user's username in the database
        // This would typically be done in a server action or API route
        // For now, we'll just return the data
        return { data, error };
    }
}

export const signIn = async (email: string, password: string) => {
    console.log('Signing in...');
    const { data, error } = await authClient.signIn.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        callbackURL: "/user" // A URL to redirect to after the user verifies their email (optional)
    });
    if (error) {
        throw error;
    } else {
        return { data, error };
    }
}

export const googleSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "google"
    })
    return data;
}

export const signOut = async () => {
    const { data, error } = await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {},
            onError: (ctx) => {
                throw ctx.error;
            },
        },
    });
    if (error) {
        throw error;
    }else{
        return { data, error };
    }
}