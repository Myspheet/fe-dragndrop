"use client";

import { serverUrl } from "@/env";
import Link from "next/link";
import { accessToken } from "@/constant";
import { FormEvent, useState } from "react";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const cookies = useCookies();
    const router = useRouter();

    const signIn = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");

            const formFields = { email, password };
            let result;

            const response = await fetch(`${serverUrl}/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formFields),
            });

            result = await response.json();
            if (result.statusCode === 401) {
                throw new Error(result.message);
            }

            cookies.set(accessToken, result.accessToken);
            router.push("/");
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Login
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={signIn}
                        >
                            <p className="text-red-500">
                                {error ? `${error}` : ""}
                            </p>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Login
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account?{" "}
                                <Link
                                    href="/register"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Sign Up here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
