import type { ImageQuestionResponse } from "./assets/type";
import { useEffect, useRef, useState } from "react";

type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export default function ImageEditing({ image }: { image: ImageQuestionResponse }) {

    const divRef = useRef<HTMLImageElement>(null);


    const [drawing, setDrawing] = useState<boolean>(false);

    const [start, setStart] = useState({
        x: 0,
        y: 0
    });

    const [posX, setPosX] = useState<number>(0);
    const [posY, setPosY] = useState<number>(0);

    const [currentRectangle, setCurrentRectangle] = useState<Rectangle | null>(null);

    const [rectangles, setRectangles] = useState<Rectangle[]>([]);

    const [rectData, setRectData] = useState<Rectangle[]>([]);





    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {

        if(!divRef.current) return;

        const div = divRef.current;

        const rect = div.getBoundingClientRect();

        if (e.button == 2) {

            e.preventDefault();
            setRectangles(r => r.slice(0, -1));
            setRectData(r => r.slice(0, -1));

            return;
        }


        console.log("Mouse X: " + e.clientX);
        console.log("Mouse Y: " + e.clientY);
        console.log("Div X: " + rect.left);
        console.log("Div y: " + rect.top);

        setPosX(rect.left);
        setPosY(rect.top);


        const x = e.clientX;
        const y = e.clientY;

        setStart({ x, y });
        setDrawing(true);

        setCurrentRectangle({
            x,
            y,
            width: 0,
            height: 0
        });


    };

    const handleMouseUp = () => {
        if (!currentRectangle) return; 

        const newRect: Rectangle = {
            x: currentRectangle.x-posX,
            y: currentRectangle.y-posY,
            width: currentRectangle.width,
            height: currentRectangle.height
        }

        setRectData(prev => [
            ...prev,
            newRect
        ]);



        setRectangles(prev => [
            ...prev,
            currentRectangle
        ]);

        setCurrentRectangle(null);
        setDrawing(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!drawing) return;




        // const currentX = e.clientX - rect.left;
        // const currentY = e.clientY - rect.top;

        const currentX = e.clientX;
        const currentY = e.clientY;


        setCurrentRectangle({
            x: Math.min(start.x, currentX),
            y: Math.min(start.y, currentY),
            width: Math.abs(currentX - start.x),
            height: Math.abs(currentY - start.y)
        });
    };




    return (

        <>


            <div className="flex flex-col items-center justify-start h-screen w-full bg-gray-200 p-15">
                <div
                    ref={divRef}
                    className="w-fit border border-gray-300 rounded-lg shadow-2xl mb-4"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <img
                        src={image.url}
                        className="h-[80dvh] w-auto block rounded-lg"
                    />
                </div>
                {rectangles.map((rectangle, index) => (
                    <div
                        key={index}
                        className="absolute border-2 border-blue-500 bg-blue-500"
                        style={{
                            left: rectangle.x,
                            top: rectangle.y,
                            width: rectangle.width,
                            height: rectangle.height
                        }}
                    />
                ))}
                {currentRectangle && (
                    <div
                        className="absolute border-2 border-blue-500 bg-blue-500"
                        style={{
                            left: currentRectangle.x,
                            top: currentRectangle.y,
                            width: currentRectangle.width,
                            height: currentRectangle.height
                        }}
                    />
                )}
                <button className="bg-blue-600 hover:bg-blue-700 w-40 text-white font-bold py-2 px-4 rounded-full" onClick={()=>console.log(rectData)}>Save Changes</button>
            </div>


        </>
    )

}