import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { signup } from "./actions";

export default function SignupForm() {
	const errorMessage = null;

	return (
		<form action={signup} className="space-y-3">
			<div className="flex-1 rounded-lg  px-6 pb-4 pt-8 bg-zinc-800">
				<h1 className={`mb-3 text-2xl text-zinc-50`}>Signup</h1>
				<div className="w-full">
					<div>
						<label className="mb-3 mt-5 block text-xs font-medium text-zinc-50" htmlFor="email">
							Email
						</label>
						<div className="relative">
							<AtSymbolIcon
								width={16}
								className="absolute top-1/2 bottom-1/2 translate-x-1/2 left-0 -translate-y-1/2"
							/>
							<input
								className="focus:border-indigo-400 peer block w-full rounded-md border border-indigo-50 py-[9px] pl-10 text-sm outline-0 placeholder:text-gray-500"
								id="email"
								type="email"
								name="email"
								placeholder="Enter your email address"
								required
							/>
						</div>
					</div>
					<div className="mt-4">
						<label className="mb-3 mt-5 block text-xs font-medium text-zinc-50" htmlFor="password">
							Password
						</label>
						<div className="relative">
							<LockClosedIcon
								width={16}
								className="absolute top-1/2 bottom-1/2 translate-x-1/2 left-0 -translate-y-1/2"
							/>
							<input
								className="focus:border-indigo-400 peer block w-full rounded-md border border-indigo-50 py-[9px] pl-10 text-sm outline-0 placeholder:text-gray-500"
								id="password"
								type="password"
								name="password"
								placeholder="Enter password"
								required
								minLength={6}
							/>
						</div>
					</div>
				</div>

				<button className="mt-4 w-full cursor-pointer hover:text-zinc-400 transition-colors">Sign up</button>
				<div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
					{errorMessage && (
						<>
							<p className="text-sm text-red-500">{errorMessage}</p>
						</>
					)}
				</div>
			</div>
		</form>
	);
}
