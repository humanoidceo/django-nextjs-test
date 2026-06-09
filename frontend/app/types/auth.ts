export interface RegisterData {
    first_name: string;
    email: string;
    password: string;
    confirm_password: string;


}


export interface RegisterResponse {
    id: number;
    first_name: string;
    email: string;
}