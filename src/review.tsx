import React, { useEffect, useState } from "react";
import type { Question, imageRectangles, reviewProps } from "./assets/type";
//@ts-ignore
import sprite from './assets/sprite.svg';
import Cards from "./cards.tsx";





export default function Review({ groupId }: { groupId: number }) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [questionImage, setQuestionImage] = useState<reviewProps[]>([]);




    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedQuestions: Question[] = await getQuestions();
                const fetchedImages: imageRectangles[] = await getImages();

                setQuestionImage(shaffleArray(combineQuestionsAndImages(fetchedImages, fetchedQuestions)));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchData();
    }, []);

    const shaffleArray = (array: reviewProps[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

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

    const combineQuestionsAndImages = (imageData: imageRectangles[], questionData: Question[]) => {

        const combinedData: reviewProps[] = [];

        for (const question of questionData) {

            combinedData.push({
                description: question.description,
                explanation: question.explanation,
                answer: question.answer,
                imageRect: null
            });
        }

        for (const image of imageData) {
            combinedData.push({
                description: null,
                explanation: null,
                answer: null,
                imageRect: [image]
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




    return (
        <div className="flex flex-col items-center justify-center h-full w-full ">
            <div className="flex flex-col items-center justify-between border-2  border-gray-300 p-6 pl-6 rounded-lg shadow-2xl mb-4 text-2xl font-bold">
                {
                    questionImage[currentQuestionIndex]?.description && (
                        <div>
                            <Cards card={questionImage[currentQuestionIndex]} />
                        </div>
                    )
                }
                {
                    questionImage[currentQuestionIndex]?.imageRect && (
                        <div className="relative w-fit">
                            <img
                                src={questionImage[currentQuestionIndex]?.imageRect[0]?.url ?? ""}
                                className="h-[70dvh] w-auto block rounded-lg"
                            />
                            {questionImage[currentQuestionIndex]?.imageRect[0]?.rectangles?.map((rectangle, col) => (
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
                        </div>




                    )

                }

            </div>

            <div className="flex flex-row items-center justify-center gap-2">
                <button className="flex items-center border border-black text-black py-2 px-4 rounded hover:cursor-pointer" onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                ><svg
                    className="w-5 h-5 text-black "
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                >
                        <use href={`${sprite}#arrow-left`} />
                    </svg>previous</button>
                <div className=" rounded-2xl  h-4  bg-gray-400 w-30 m-2">
                    <div className="bg-blue-500 h-full  rounded-2xl" style={{ width: `${((currentQuestionIndex + 1) / questionImage.length) * 100}%` }}></div>
                </div>
                <button className="flex items-center border border-black text-black py-2 px-4 rounded hover:cursor-pointer" onClick={() => setCurrentQuestionIndex((prev) => Math.min(questionImage.length - 1, prev + 1))}>
                    next
                    <svg
                        className="w-5 h-5 text-black "
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                    >
                        <use href={`${sprite}#arrow-right`} />
                    </svg>
                </button>
            </div>
        </div>

    );
}