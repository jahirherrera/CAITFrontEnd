export interface UserLogin {
    username: string;
    password: string;   
}

export interface Group {
    id: number;
    name: string;
}

export interface GroupDetails {
    name: string;
    user_username : string;
}