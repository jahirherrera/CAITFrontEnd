import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Question, imageRectangles, reviewProps, addingQuesitonAnwser, testProps } from "./assets/type";
import { useNavigate } from 'react-router-dom';

export default function Test() {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [questionImage, setQuestionImage] = useState<testProps[]>([]);

    const [inputAnswer, setInputAnswer] = useState<string>("");
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [imageDifficulty, setImageDifficulty] = useState<number | null>(null);
    const [warning, setWarning] = useState<string>("");




    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedQuestions: addingQuesitonAnwser[] = await getQuestions();
                const fetchedImages: imageRectangles[] = await getImages();

                setQuestionImage(shaffleArray(combineQuestionsAndImages(fetchedImages, fetchedQuestions)));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchData();
    }, []);

    const shaffleArray = (array: testProps[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const getQuestions = async () => {

        try {
            const response = await fetch(`http://localhost:8080/getQuestionsTest/${groupId}`, {
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
            return data;
        }
        catch (error) {
            console.error("Fetching questions failed", error);
        }
    };

    const getImages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/imageRectangle/${groupId}`, {
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
            return data;

        } catch (error) {
            console.error("Fetching image questions failed", error);
        }
    }

    const combineQuestionsAndImages = (imageData: imageRectangles[], questionData: addingQuesitonAnwser[]) => {

        const combinedData: testProps[] = [];

        for (const question of questionData) {

            combinedData.push({
                images: null,
                questions: question
            });
        }

        for (const image of imageData) {
            combinedData.push({
                images: image,
                questions: null
            });
        }

        return combinedData;
    }

    const deleteRectangle = (rectangleId: number) => {
        setQuestionImage(prev =>
            prev.map((item, index) => {
                if (index !== currentQuestionIndex || !item.imageRect) {
                    return item;
                }

                return {
                    ...item,
                    imageRect: item.imageRect.map((image) => ({
                        ...image,
                        rectangles: image.rectangles?.filter(
                            rect => rect.id !== rectangleId
                        )
                    }))
                };
            })
        );
    }

    const sumbitAnswer = () => {
        if (currentQuestionIndex >= questionImage.length - 1) {
            console.log("All questions answered. Displaying results..." + questionImage.forEach((q) => { console.log(q) }));
            return;
        }
        if (isAnswerSubmitted) {
            setInputAnswer("");
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(null);
            setImageDifficulty(null);
            setWarning("");
            setCurrentQuestionIndex((prev) => Math.min(questionImage.length - 1, prev + 1))
        } else {

            if (inputAnswer.trim() == "" && imageDifficulty == null) {
                setWarning("Please enter an answer.");
                return;
            } else {
                if (inputAnswer.trim() !== "") {
                    const correctAnswer = questionImage[currentQuestionIndex].questions?.answerDTO.find(a=>a.isCorrect);
                    correctAnswer?.description.toLowerCase() === inputAnswer.trim().toLowerCase() ? setIsAnswerCorrect(true) : setIsAnswerCorrect(false);
                    console.log("Answer submitted: ", inputAnswer.toLocaleLowerCase());
                    console.log("Correct answer: ", correctAnswer?.description.toLowerCase());
                }
                setIsAnswerSubmitted(true);
                setWarning("");
            }
        }
    }

    useEffect(() => {
        if (isAnswerCorrect == null) {
            console.log("nothing happened");
            return;
        }

        const point = isAnswerCorrect ? -1 : 2;

        setQuestionImage(q => {
            const updatedQuestions = [...q];
            const currentQuestion = updatedQuestions[currentQuestionIndex];

            // updatedQuestions[currentQuestionIndex] = {
            //     ...currentQuestion,
            //     points: (currentQuestion.points || 0) + point,
            // };

            return updatedQuestions;
        })

    }, [isAnswerCorrect]);

    const { groupId } = useParams();
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <section className="flex flex-col items-center justify-between border-2  border-gray-300 p-6 pl-6 rounded-lg shadow-2xl mb-4 text-2xl font-bold">
                {
                    questionImage[currentQuestionIndex]?.questions && (
                        <div className="flex flex-col items-center justify-between    gap-2 rounded-lg mb-4 text-2xl font-bold">
                            <div className="text-center mb-2">{questionImage[currentQuestionIndex]?.questions.questionDTO.description}</div>
                            <input
                                placeholder="Enter your answer..."
                                className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none  ${isAnswerSubmitted ? (isAnswerCorrect ? 'bg-green-200' : 'bg-red-200') : ''}`}
                                value={inputAnswer}
                                onChange={(e) => setInputAnswer(e.target.value)}
                            />
                        </div>

                    )
                }
                {
                    questionImage[currentQuestionIndex]?.images && (
                        <div className="relative w-fit">
                            <img
                                src={questionImage[currentQuestionIndex]?.images.url ?? ""}
                                className="h-[70dvh] w-auto block rounded-lg"
                            />
                            {questionImage[currentQuestionIndex]?.images?.rectangles?.map((rectangle, col) => (
                                <div
                                    key={col}
                                    onClick={() => deleteRectangle(rectangle.id)}
                                    className="absolute border-2 border-red-500 bg-red-500 flex items-center justify-center"
                                    style={{
                                        left: rectangle.x,
                                        top: rectangle.y,
                                        width: rectangle.width,
                                        height: rectangle.height,
                                    }}
                                >{col + 1}</div>
                            )
                            )}

                            <section className="flex flex-row items-center justify-center gap-2 mt-4">
                                <button className="bg-green-500 text-white py-1 px-2 rounded" onClick={() => setImageDifficulty(1)}>Easy 100%-90%</button>
                                <button className="bg-orange-500 text-white py-1 px-2 rounded" onClick={() => setImageDifficulty(2)}>Medium 89%-70%</button>
                                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => setImageDifficulty(3)}>Hard 69% and below</button>
                            </section>
                        </div>


                    )

                }

            </section>
            <h4 className="text-red-500 min-h-3">{warning}</h4>
            <button className="flex items-center border border-black text-black py-2 px-4 rounded hover:cursor-pointer" onClick={() => sumbitAnswer()}>
                {
                    isAnswerSubmitted ? (
                        <span className="">Next Question</span>
                    ) : (
                        <span>Submit Answer</span>
                    )
                }
            </button>
        </div>
    )
}