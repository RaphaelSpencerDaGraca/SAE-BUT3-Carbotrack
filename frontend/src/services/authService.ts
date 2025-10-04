import api from './api';

interface AuthResponse{
    token:string;
    userId:string;
}

interface UserData{
    email:string;
    password:string;
    pseudo:string;
}

export const register = async (userData:UserData):Promise<AuthResponse> => {
    const response = await  api.post('/auth/register',userData);
    return response.data
};

export const login = async (userData:UserData):Promise<AuthResponse> => {
    const response = await  api.post('/auth/login',userData);
    localStorage.setItem('token', response.data.token); //permet de stocker le tocken
    return response.data
};

export const logout = (): void =>{
    localStorage.removeItem('token');
}
