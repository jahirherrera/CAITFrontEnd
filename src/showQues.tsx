import { useEffect, useState } from "react";
import type { Question, ImageQuestion, ImageQuestionResponse } from "./assets/type";
import ImageEditing from './imageEditing.tsx'



export default function ShowQues({ groupId }: { groupId: number }) {


    const [questions, setQuestions] = useState<Question[]>([]);
    const [imageQuestions, setImageQuestions] = useState<ImageQuestionResponse[]>([]);

    const [alert, setAlert] = useState<string>("");

    const [addQues, setAddQues] = useState<boolean>(false);
    const [wholeQuestion, setWholeQuestion] = useState<string>("");

    const [clickImage, setClickImage] = useState<boolean>(false);
    const [imageClicked,setImageClicked] = useState<ImageQuestionResponse | null>(null);



    const [addFile, setAddFile] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);

    useEffect(() => {
        getQuestions();
        getImages();
    }, []);


    const getQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:8080/getQuestions/${groupId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Could not fetch questions.");
            }
            const data = await response.json();
            setQuestions(data);
        }
        catch (error) {
            console.error("Fetching questions failed", error);
        }
    };

    const deleteQuestion = async (questionId: number | null) => {
        if (!questionId) return;

        try {
            const response = await fetch(`http://localhost:8080/deletingQuestion/${questionId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Could not delete question.");
            }
            getQuestions();
        }
        catch (error) {
            console.error("Deleting question failed", error);
        }
    };

    const getImages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/image/${groupId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Could not fetch image questions.");
            }

            const data = await response.json();
            setImageQuestions(data);

        } catch (error) {
            console.error("Fetching image questions failed", error);
        }
    }



    const wholeQuestionHandler = async () => {

        if (wholeQuestion.trim() === "") {
            setAlert("Question cannot be empty");
            return;
        }

        if (!wholeQuestion.includes("{") && !wholeQuestion.includes("?")) {
            setAlert("Question must contain either '{...}' or '?' to indicate the answer.");
            return;
        }

        const newQuestion: Question = {
            id: 0,
            description: "",
            answer: "",
            groupId: groupId,
        };

        if (wholeQuestion.includes("{") && wholeQuestion.includes("}")) {
            const firstPart = wholeQuestion.substring(0, wholeQuestion.indexOf("{"));
            const secondPart = wholeQuestion.substring(wholeQuestion.indexOf("}") + 1);
            const answer = wholeQuestion.substring(wholeQuestion.indexOf("{") + 1, wholeQuestion.indexOf("}"));

            newQuestion.description = firstPart + "..." + secondPart;
            newQuestion.answer = answer;

        } else if (wholeQuestion.includes("?")) {
            const firstPart = wholeQuestion.substring(0, wholeQuestion.indexOf("?"));
            const answer = wholeQuestion.substring(wholeQuestion.indexOf("?") + 1);
            newQuestion.description = firstPart + "?";
            newQuestion.answer = answer;

        } else {
            setAlert("Question must contain either '{ }' or '?' to indicate the answer.");
        }


        try {
            const response = await fetch(`http://localhost:8080/addQuestion`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newQuestion)
            });
            if (!response.ok) {
                throw new Error("Could not add question.");
            }
            setAddQues(false);
            setAlert("");
            setWholeQuestion("");
            getQuestions();
        }
        catch (error) {
            console.error("Adding question failed", error);
        }

    }

    const addingImageHandler = async () => {
        if (!file) {
            setAlert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("groupId", groupId.toString());



        try {
            const response = await fetch(`http://localhost:8080/image`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Could not add image question.");
            }

            setAddFile(false);
            setAlert("");
            setFile(null);
            setImage(null);
            setAspectRatio(null);
            getQuestions();

        } catch (error) {
            console.error("Adding image question failed", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore
        const file = event.target.files[0];

        if (!file) return;

        const nameofFile = file.name;
        const lastFour = nameofFile.substring(nameofFile.length - 4).toLowerCase();
        const lastFive = nameofFile.substring(nameofFile.length - 5).toLowerCase();

        if (lastFour === ".jpg" || lastFour === ".png" || lastFour === ".mov" || lastFour === ".webp" || lastFive === ".jpeg") {
            setFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);

            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                setAspectRatio(img.width / img.height);
            }
        } else {
            ("Invalid file type. Please select a .jpg, .jpeg, .png, .mov, or .webp file.");
        }
    }

    const clickingImage=(image : ImageQuestionResponse)=>{
        setImageClicked(image);
    }

    useEffect(() => {
        if(!imageClicked) return;

        setClickImage(true)

    }, [imageClicked]);

    return (
        <>
            {
                !clickImage && <div className="flex flex-col items-center justify-start h-9/10 w-full bg-gray-200 p-15">
                {questions.map((question) => (
                    <div key={question.id} className="flex flex-row items-start justify-between border-2 h-auto  w-[50vw] border-gray-300 p-6 pl-6 rounded-lg shadow-2xl mb-4">

                        <div>
                            <h3 className="text-2xl ">{question.description}</h3>
                            <p className="text-xl text-gray-600">{question.answer}</p>
                        </div>
                        <button className=" text-xl font-bold hover:cursor-pointer pl-3 ml-2 border-l" onClick={() => deleteQuestion(question.id)}>-</button>
                    </div>

                ))}
                {imageQuestions.map((imageQuestion) => (
                    <img
                        key={imageQuestion.id}
                        src={imageQuestion.url}
                        alt="Question illustration"
                        className="w-[50vw] h-auto object-cover border border-gray-300 rounded-lg shadow-2xl mb-4"
                        onClick={()=>clickingImage(imageQuestion)}
                    />
                ))}

                <button className="flex items-center justify-center  border border-gray-400 shadow-2xl  hover:shadow-lg hover:scale-105 transition duration-200  rounded-full text-sm h-10 w-10 hover:cursor-pointer min-w-7 min-h-7 "
                    onClick={() => {
                        setAddQues(true);
                    }}
                >
                    +
                </button>
                <button className="flex items-center justify-center  border border-gray-400 shadow-2xl  hover:shadow-lg hover:scale-105 transition duration-200  rounded-full text-sm h-10 w-10 hover:cursor-pointer min-w-7 min-h-7 "
                    onClick={() => {
                        setAddFile(true);
                    }}
                >
                    FILE
                </button>

            </div>
            }

            {
                clickImage && imageClicked && <ImageEditing image={imageClicked}/>
            }


            {
                addQues && (
                    <div className={`fixed top-0 left-0 w-full h-full bg-gray-700/80 flex justify-center items-center text-white  `}>
                        <div className=" w-full max-w-sm  min-h-70 max-h-80 p-6 bg-gray-200 text-black rounded-xl shadow-xl border border-gray-400 flex flex-col items-center justify-between ">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <h2 className="text-xl font-bold mb-2">Question</h2>
                                <textarea placeholder="" className="border border-gray-300 rounded p-2 w-80  max-h-23 min-h-11" value={wholeQuestion} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWholeQuestion(e.target.value)} />
                            </div>
                            <h1 className="min-h-5 text-sm text-red-500">{alert}</h1>
                            <div className="flex flex-row items-center justify-center gap-4">
                                <button className="bg-blue-500 text-white py-1 px-2 rounded" onClick={wholeQuestionHandler}>Save</button>
                                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => { setAddQues(false); setAlert(""); setWholeQuestion(""); }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                addFile && (
                    <div className={`fixed top-0 left-0 w-full h-full bg-gray-700/80 flex justify-center items-center text-white  `}>
                        <div className=" min-h-70 h-auto  p-6 bg-gray-200 text-black rounded-xl shadow-xl border border-gray-400 flex flex-col items-center justify-between ">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <h2 className="text-xl font-bold mb-2">Upload File</h2>
                                <input type="file" placeholder="+" className="border border-gray-300 rounded m-2" onChange={handleFileChange} ></input>
                            </div>
                            <div className="w-full  border border-gray-300 rounded-lg shadow-2xl mb-4"
                                style={{
                                    aspectRatio: aspectRatio ? `${aspectRatio}` : "16/9",
                                    backgroundImage: image ? `url(${image})` : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }} />
                            <div className="flex flex-row items-center justify-center gap-4">
                                <button className="bg-blue-500 text-white py-1 px-2 rounded" onClick={addingImageHandler}>Upload</button>
                                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => { setAddFile(false); setAspectRatio(null); setImage(null); }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    )
}    