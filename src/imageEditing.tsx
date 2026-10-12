import type { ImageQuestionResponse, rectangleDTO,Rectangle } from "./assets/type";
import { useEffect, useRef, useState } from "react";



export default function ImageEditing({ image }: { image: ImageQuestionResponse }) {


    useEffect(() => {
        getRectangles();
    }, [])

    const getRectangles = async () => {
        try {
            const response = await fetch(`http://localhost:8080/rectangle/${image.id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error("Could not get the Squares");
            }
            const r = await response.json();
            setRecFromDtaBase(r);
        }
        catch (error) {
            console.error("operation failed", error);
        }
    }


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

    const [recFromDtaBase, setRecFromDtaBase] = useState<rectangleDTO[]>([]);


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {

        if (!divRef.current) return;

        const div = divRef.current;

        const rect = div.getBoundingClientRect();

        if (e.button == 2) {

            e.preventDefault();
            setRectangles(r => r.slice(0, -1));
            setRectData(r => r.slice(0, -1));

            return;
        }


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
            x: currentRectangle.x - posX,
            y: currentRectangle.y - posY,
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


        const currentX = e.clientX;
        const currentY = e.clientY;


        setCurrentRectangle({
            x: Math.min(start.x, currentX),
            y: Math.min(start.y, currentY),
            width: Math.abs(currentX - start.x),
            height: Math.abs(currentY - start.y)
        });
    };

    const saveRectangles = async () => {

        if(rectData.length === 0) return;

        const rect: rectangleDTO[] = [];

        for (const rectangles of rectData) {
            const newRectangle: rectangleDTO = {
                id: 0,
                x: rectangles.x,
                y: rectangles.y,
                width: rectangles.width,
                height: rectangles.height,
                imageId: image.id
            }
            rect.push(newRectangle)
        }

        

        try {
            const response = await fetch(`http://localhost:8080/rectangle`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(rect)
            });
            if (!response.ok) {
                throw new Error("Could not add the Squares");
            }
            getRectangles();
            setRectData([]);
            setRectangles([]);
        }
        catch (error) {
            console.error("operation failed", error);
        }
    }

    const deleteRectangleFromDatabase = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/rectangle/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                throw new Error("Could not delete the Square");
            }
            getRectangles();

        }
        catch (error) {
            console.error("operation failed", error);
        }
    }


    return (

        <>


            <div className="flex flex-col items-center justify-start h-auto w-full bg-gray-200 p-15">
                <div
                    ref={divRef}
                    className="relative w-fit border border-gray-300 rounded-lg shadow-2xl mb-4"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <img
                        src={image.url}
                        className="h-[70dvh] w-auto block rounded-lg"
                    />
                    {recFromDtaBase.map((rectangle, col) => (
                        <div
                            key={col}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onClick={(e) => {e.stopPropagation;deleteRectangleFromDatabase(rectangle.id)}}
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
                <button className="bg-blue-600 hover:bg-blue-700 w-40 text-white font-bold py-2 px-4 rounded-full" onClick={saveRectangles}>Save Changes</button>
            </div>


        </>
    )

}