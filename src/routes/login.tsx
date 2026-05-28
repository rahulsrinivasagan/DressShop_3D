import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Account — MAISON NOIR" }, { name: "description", content: "Sign in to your MAISON NOIR account." }] }),
  component: Login,
});

function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
      <div className="hidden md:block relative overflow-hidden">
        <motion.img
          src={hero} alt="" width={1920} height={1080}
          initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/70 to-transparent" />
        <Link to="/" className="absolute top-8 left-8 text-2xl font-display italic font-semibold">MAISON NOIR</Link>
        <div className="absolute bottom-12 left-8 right-8">
          <p className="text-3xl font-display italic leading-tight max-w-md">
            "An archive of moments, kept in silk."
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-8 md:px-20 py-16">
        <Link to="/" className="md:hidden text-2xl font-display italic font-semibold mb-12">MAISON NOIR</Link>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{mode === "signin" ? "Welcome back" : "Begin"}</span>
        <h1 className="text-5xl font-display italic mt-4 mb-12">
          {mode === "signin" ? "Sign in." : "Create account."}
        </h1>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && (
            <Field label="Name" type="text" />
          )}
          <Field label="Email" type="email" />
          <Field label="Password" type="password" />
          <button className="mt-4 px-10 py-4 bg-foreground text-background rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent transition-colors w-full">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground self-start">
          {mode === "signin" ? "New here? Create an account →" : "Already a client? Sign in →"}
        </button>
      </div>
    </main>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div className="border-b border-border pb-2">
      <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</label>
      <input type={type} className="w-full bg-transparent outline-none mt-2 text-lg font-light" />
    </div>
  );
}
