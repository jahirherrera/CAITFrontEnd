export interface UserLogin {
    username: string;
    password: string;   
}

export interface Group {
    id: number;
    name: string;
}

export interface GroupDetails {
    id: number | null;
    name: string;
    nextReview: string | null;
    username : string;
}

export interface Question {
    id: number | null;
    description: string;
    explanation: string;
    isEnable: boolean;
    answer: string;
    groupId: number;
    points: number;
}

export interface questionDTO{
    id: number | null;
    description: string;
    explanation: string;
    isEnable: boolean;
    points: number;
}

export interface answerDTO{
    id:number;
    description:string;
    isCorrect:boolean;
}

export interface addingQuesitonAnwser{
    groupId:number;
    questionDTO : questionDTO;
    answerDTO : answerDTO[];
}

export interface ImageQuestion{
    file : FormData;
    groupId : number;
}

export interface ImageQuestionResponse{
    id: number;
    groupId: number;
    url: string;
    points: number;
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
    imageId: number;
}

export interface imageRectangles{
    id: number;
    groupId: number;
    url: string;
    points: number;
    rectangles: rectangleDTO[];
}

export interface reviewProps{
    description: string | null;
    explanation: string | null;
    answer: string | null;
    imageRect: imageRectangles[] | null;
    points: number;
};



export interface testProps{
    questions : addingQuesitonAnwser | null;
    images : imageRectangles | null
    ;
}



