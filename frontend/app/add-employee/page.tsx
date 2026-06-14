'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;

interface Employee {
    id: number;
    name: string;
    position: string;
    salary: string;
}

const API_URL = "http://localhost:8000/employees/";
const ME_URL = "http://localhost:8000/me/";

export default function AddTaskPage() {
    const router = useRouter();

    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    // Form fields for adding a new employee
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");

    // Fields for editing an existing employee
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    // Triggers: setting these starts the corresponding useEffect below
    const [addTrigger, setAddTrigger] = useState<{ name: string; position: string; salary: string } | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState<{ id: number; name: string } | null>(null);
    const [deleteTrigger, setDeleteTrigger] = useState<number | null>(null);

    // Check the logged-in user's role before showing the page
    useEffect(() => {
        axios.get(ME_URL)
            .then(response => {
                const role = response.data.role;
                if (role === "admin" || role === "super_admin") {
                    setAuthorized(true);
                } else {
                    router.push("/");
                }
            })
            .catch(() => {
                router.push("/login");
            })
            .finally(() => setAuthChecked(true));
    }, []);

    // Load all employees once we know the user is authorized
    useEffect(() => {
        if (!authorized) return;

        axios.get(API_URL)
            .then(response => setEmployees(response.data))
            .catch(err => setError(err.message));
    }, [authorized]);

    // Add a new employee
    useEffect(() => {
        if (!addTrigger) return;

        setError("");
        setLoading(true);

        axios.post(API_URL, addTrigger)
            .then(response => {
                setEmployees([...employees, response.data]);
                setName("");
                setPosition("");
                setSalary("");
            })
            .catch(err => setError(err.message))
            .finally(() => {
                setLoading(false);
                setAddTrigger(null);
            });
    }, [addTrigger]);

    // Update an existing employee
    useEffect(() => {
        if (!updateTrigger) return;

        setError("");

        axios.put(`${API_URL}${updateTrigger.id}/`, { name: updateTrigger.name })
            .then(response => {
                const updatedEmployees = employees.map(emp =>
                    emp.id === updateTrigger.id ? response.data : emp
                );
                setEmployees(updatedEmployees);
                setEditingId(null);
                setEditName("");
            })
            .catch(err => setError(err.message))
            .finally(() => setUpdateTrigger(null));
    }, [updateTrigger]);

    // Delete an employee
    useEffect(() => {
        if (deleteTrigger === null) return;

        setError("");

        axios.delete(`${API_URL}${deleteTrigger}/`)
            .then(() => {
                const remainingEmployees = employees.filter(emp => emp.id !== deleteTrigger);
                setEmployees(remainingEmployees);
            })
            .catch(err => setError(err.message))
            .finally(() => setDeleteTrigger(null));
    }, [deleteTrigger]);

    function startEdit(employee: Employee) {
        setEditingId(employee.id);
        setEditName(employee.name);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName("");
    }

    // Only show employees whose name matches the search box
    const visibleEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase())
    );

    // Don't show anything until we know if the user is allowed here
    if (!authChecked) {
        return <p>Loading...</p>;
    }

    if (!authorized) {
        return null;
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search task..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
                maxLength={5}
            />
            <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="position"
                maxLength={5}
            />
            <input
                type="text"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="salary"
                maxLength={5}
            />

            <button onClick={() => setAddTrigger({ name, position, salary })} disabled={loading || !name.trim()}>
                {loading ? "Adding..." : "add task"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {visibleEmployees.map(employee => (
                    <li key={employee.id}>
                        {editingId === employee.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                />
                                <button onClick={() => setUpdateTrigger({ id: employee.id, name: editName })} disabled={!editName.trim()}>
                                    Save
                                </button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {employee.name} (id = {employee.id})
                                <button onClick={() => startEdit(employee)}>Edit</button>
                                <button onClick={() => setDeleteTrigger(employee.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}