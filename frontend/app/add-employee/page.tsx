'use client';

import { useState, useEffect } from "react";
import { Employee, EmployeeInput, getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/employees";

export default function AddTaskPage() {
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<EmployeeInput>({
        name: "",
        position: "",
        salary: "",
    });

    const [createTrigger, setCreateTrigger] = useState<EmployeeInput | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState<{ id: number; data: EmployeeInput } | null>(null);
    const [deleteTrigger, setDeleteTrigger] = useState<number | null>(null);

    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch(err => setError(err.response?.data?.message || err.message));
    }, []);

    useEffect(() => {
        if (!createTrigger) return;

        setError("");
        setLoading(true);

        createEmployee(createTrigger)
            .then(newEmployee => {
                setEmployees(prev => [...prev, newEmployee]);
                setName("");
                setPosition("");
                setSalary("");
            })
            .catch(err => setError(err.response?.data?.message || err.message))
            .finally(() => {
                setLoading(false);
                setCreateTrigger(null);
            });
    }, [createTrigger]);

    useEffect(() => {
        if (!updateTrigger) return;

        setError("");

        updateEmployee(updateTrigger.id, updateTrigger.data)
            .then(updated => {
                setEmployees(prev => prev.map(e => e.id === updateTrigger.id ? updated : e));
                setEditingId(null);
                setEditValue({ name: "", position: "", salary: "" });
            })
            .catch(err => setError(err.response?.data?.message || err.message))
            .finally(() => setUpdateTrigger(null));
    }, [updateTrigger]);

    useEffect(() => {
        if (deleteTrigger === null) return;

        setError("");

        deleteEmployee(deleteTrigger)
            .then(() => setEmployees(prev => prev.filter(e => e.id !== deleteTrigger)))
            .catch(err => setError(err.response?.data?.message || err.message))
            .finally(() => setDeleteTrigger(null));
    }, [deleteTrigger]);

    const visibleEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    function handleSubmit() {
        setCreateTrigger({ name, position, salary });
    }

    function startEdit(e: Employee) {
        setEditingId(e.id);
        setEditValue({ name: e.name, position: e.position, salary: e.salary });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValue({ name: "", position: "", salary: "" });
    }

    function saveEdit(id: number) {
        setUpdateTrigger({ id, data: editValue });
    }

    function deleteTask(id: number) {
        setDeleteTrigger(id);
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

            <button onClick={handleSubmit} disabled={loading || !name.trim()}>
                {loading ? "Adding..." : "add task"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {visibleEmployees.map(e => (
                    <li key={e.id}>
                        {editingId === e.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editValue.name}
                                    onChange={ev => setEditValue(prev => ({ ...prev, name: ev.target.value }))}
                                />
                                <button onClick={() => saveEdit(e.id)} disabled={!editValue.name.trim()}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {e.name} (id = {e.id})
                                <button onClick={() => startEdit(e)}>Edit</button>
                                <button onClick={() => deleteTask(e.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}