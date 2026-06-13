import axios from "axios";

const BASE_URL = "http://localhost:8000/employees/";

export interface Employee {
    id: number;
    name: string;
    position: string;
    salary: string;
}

export interface EmployeeInput {
    name: string;
    position: string;
    salary: string;
}

export const getEmployees = () =>
    axios.get<Employee[]>(BASE_URL).then(res => res.data);

export const createEmployee = (data: EmployeeInput) =>
    axios.post<Employee>(BASE_URL, data).then(res => res.data);

export const updateEmployee = (id: number, data: EmployeeInput) =>
    axios.put<Employee>(`${BASE_URL}${id}/`, data).then(res => res.data);

export const deleteEmployee = (id: number) =>
    axios.delete(`${BASE_URL}${id}/`);