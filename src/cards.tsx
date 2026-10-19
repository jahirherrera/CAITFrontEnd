import React, { useState } from "react";
import type { reviewProps } from "./assets/type";


export default function Cards({ card }: { card: reviewProps }) {

    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    return (
        <div>
            <h1 className="flex flex-row items-center justify-between border-2 h-25  min-w-100 border-gray-300 p-6 pl-6 rounded-lg shadow-2xl mb-4 text-2xl font-bold hover:cursor-pointer">{card.description}</h1>
            <h1 onClick={() => setShowAnswer(!showAnswer)}
                className={`bg-yellow-100 ${showAnswer ? 'blur-none' : 'blur-sm'} flex flex-row items-center justify-between h-25 min-w-100 p-6 pl-6 rounded-lg text-2xl font-bold mb-4 hover:cursor-pointer`}>
                {card.answer}
            </h1>
            <h1 onClick={() => setShowExplanation(!showExplanation)}
                className={`bg-yellow-100 ${showExplanation ? 'blur-none' : 'blur-sm'} flex flex-row items-center justify-between h-25 min-w-100 p-6 pl-6 rounded-lg shadow-2xl text-2xl font-bold mb-4 hover:cursor-pointer`}>
                {card.explanation}
            </h1>
        </div>
    )
}


