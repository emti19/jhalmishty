import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error || !data.session) {
      setError(
        error?.message ?? "Failed to sign in. Please check your credentials.",
      );
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8">
          <div className="mb-8">
            <p className="text-[#F4A261] font-medium text-sm uppercase tracking-wide">
              Admin Login
            </p>
            <h1 className="text-3xl font-bold text-[#1A2E28] mt-3">
              Secure Administrator Access
            </h1>
            <p className="text-[#4a6b5f] mt-2">
              Sign in with your Supabase credentials to manage products.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-sm text-[#B91C1C]">{error}</p>}

            <label className="block text-sm font-medium text-[#334155]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </label>

            <label className="block text-sm font-medium text-[#334155]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#2F5D50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#26493f] disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-[#64748B] mt-6">
            Make sure an admin user exists in your Supabase Auth dashboard. Use
            email and password credentials there.
          </p>
        </div>
      </div>
    </section>
  );
}
