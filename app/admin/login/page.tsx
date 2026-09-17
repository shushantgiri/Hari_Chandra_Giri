"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "./actions";

const initialState: SignInState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-3xl uppercase text-paper">Athlete Management</p>
        <p className="mt-2 font-sans text-sm text-stone">Sign in to manage the site.</p>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-sans text-xs uppercase tracking-[0.15em] text-stone"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full border-b border-line-strong bg-transparent px-0 py-3 font-sans text-base text-paper outline-none transition-colors duration-300 focus:border-paper"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-sans text-xs uppercase tracking-[0.15em] text-stone"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full border-b border-line-strong bg-transparent px-0 py-3 font-sans text-base text-paper outline-none transition-colors duration-300 focus:border-paper"
            />
          </div>

          {state.error ? (
            <p role="alert" className="font-sans text-sm text-crimson-2">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full border border-paper bg-paper px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
