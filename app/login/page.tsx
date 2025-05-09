"use client";
import { Suspense, useState } from "react";
import LoginForm from "./login-form";
import Image from "next/image";
import SignupForm from "./signup-form";

export default function LoginPage() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<main className="flex items-center justify-center md:h-screen">
			<div className="bg-zinc-800 relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 border border-solid border-indigo-50 rounded-lg">
				<div className="flex h-50 w-full justify-center items-center p-3">
					<div className="w-48 text-zinc-900 md:w-50 relative h-full">
						<Image src={"/logo.svg"} alt="MassChat" fill />
					</div>
				</div>
				<Suspense>{isLogin ? <LoginForm /> : <SignupForm />}</Suspense>
				{isLogin ? (
					<p>
						Don't have an account?{" "}
						<a className="cursor-pointer hover:underline hover:text-indigo-400" onClick={() => setIsLogin(false)}>
							Sign up
						</a>
					</p>
				) : (
					<p>
						Already have an account?{" "}
						<a className="cursor-pointer hover:underline hover:text-indigo-400" onClick={() => setIsLogin(true)}>
							Login
						</a>
					</p>
				)}
			</div>
		</main>
	);
}
