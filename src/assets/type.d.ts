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

export interface Question {
    id: number | null;
    description: string;
    answer: string;
    groupId: number;
}

export interface ImageQuestion{
    file : FormData;
    groupId : number;
}

export interface ImageQuestionResponse{
    id: number;
    groupId: number;
    url: string;
}
export interface Rectangle{
    x: number;
    y: number;
    width: number;
    height: number;
};

export interface rectangleDTO{
    id: number
    x: number;
    y: number;
    width: number;
    height: number;
    id_image: number;
}



