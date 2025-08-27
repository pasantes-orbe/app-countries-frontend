export interface UserInterface {
    id: number;
    email: string;
    name: string;
    lastname: string;
    password: string;
    phone: string;
    birthday: Date;
    dni: number;
    avatar: string | null;
    role_id: number;
    role: {  // Esta propiedad existía en los datos pero no en la interfaz
        name: string;
    };
}
export interface User {
    id: number;
    email: string;
    name: string;
    lastname: string;
    password: string;
    phone: string;
    birthday: Date;
    dni: number;
    avatar: string | null;
    role_id: number;
    role: {  // Esta propiedad existía en los datos pero no en la interfaz
        name: string;
    };
}