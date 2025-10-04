export interface User{
    email:string;
    password:string;
    pseudo:string;
}

export interface AuthContextType{
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string,pseudo:string) => Promise<void>;
    logout:()=> void;
}