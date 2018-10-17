export interface Roles {
    student?: boolean;
    faculty?: boolean;
    admin?: boolean;
}

export interface User {
    userId: string;
    email: string;
    roles: Roles;
    concentration: string;
    degree: string;
    skills: string[];
}

