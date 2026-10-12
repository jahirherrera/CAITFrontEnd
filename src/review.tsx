import React, { useEffect, useState } from "react";
import type { Question, ImageQuestionResponse } from "./assets/type";

export default function Review({ groupId }: { groupId: number }) {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [images, setImages] = useState<ImageQuestionResponse[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);


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
            setImages(data);

        } catch (error) {
            console.error("Fetching image questions failed", error);
        }
    }




    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div>
                <h1 className="text-2xl font-bold mb-4">{questions[currentQuestionIndex]?.description}</h1>
                <h1 className="text-2xl font-bold mb-4">{questions[currentQuestionIndex]?.answer}</h1>
                <h1 className="text-2xl font-bold mb-4">{questions[currentQuestionIndex]?.explanation}</h1>
            </div>
            
            <div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}>previous</button>
                <button className="bg-green-500 text-white py-2 px-4 rounded">Show/hide</button>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}>next</button>
            </div>
        </div>

    );
}