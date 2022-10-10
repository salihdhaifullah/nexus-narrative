export interface IUser {
    id: string;
    createdAt: Date;
    email: string;
    name: string;
    role: "USER" | "ADMIN"
    token: string;
}

export interface ILogin {
    password: string
    email: string
}

export interface ISingUp {
    password: string
    name: string
    email: string
}