'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:8000";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Trigger: setting this starts the login request below
    const [loginTrigger, setLoginTrigger] = useState<{ email: string; password: string } | null>(null);

    useEffect(() => {
        if (!loginTrigger) return;

        setError("");
        setLoading(true);

        axios.post(`${API_URL}/login/`, loginTrigger)
            .then(() => {
                router.push("/");
            })
            .catch(err => setError(err.response?.data?.detail || err.message))
            .finally(() => {
                setLoading(false);
                setLoginTrigger(null);
            });
    }, [loginTrigger]);

    function handleSubmit() {
        setLoginTrigger({ email, password });
    }

    return (
        <div>
            <h1>Log in</h1>

            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button
                onClick={handleSubmit}
                disabled={loading || !email.trim() || !password.trim()}
            >
                {loading ? "Logging in..." : "Log in"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}