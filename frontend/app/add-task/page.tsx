'use client';

import { useState } from "react";
import axios from "axios";

interface Task {
    id: number;
    title: string;
    done: string;
}

export default function AddTaskPage() {
    const [title, setTitle] = useState("");
    const [saved, setSaved] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<"all" | "done" | "pending">("all");


    const filteredTasks = tasks.filter(t => {
      if (filter === "done") return t.done === "true";
      if (filter === "pending") return t.done === "false";
      return true;
    })

    async function handleSubmit() {
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/create/task",
                { title: title.trim() }
            );
            console.log(response);
            setSaved(response.data);
            setTasks(prev => [... prev, response.data]);
            setTitle("");
        } catch (err: any) {
            console.log(err);
            setError(err.response?.data?.message || err.message);
            console.log(err.response?.status);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task title"
                maxLength={5}
            />

            <button onClick={handleSubmit} disabled={loading || !title.trim()}>
                {loading ? "Adding..." : "add task"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {saved ? <p>Saved: {saved.title} (id={saved.id})</p> : <p>Not Saved</p>}

            <ul>
              {tasks.map(t => (
                <li key={t.id}>{t.title} (id = {t.id})</li>
              ))}
            </ul>

            <div>
              <button onClick={() => setFilter("all")}>ALL</button>
              <button onClick={() => setFilter("pending")}>Pending</button>
              <button onClick={() => setFilter("done")}>Done</button>
            </div>
        </div>
    );
}