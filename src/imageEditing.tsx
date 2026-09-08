import type { ImageQuestionResponse } from "./assets/type";
import { useEffect, useRef, useState } from "react";

type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export default function ImageEditing({ image }: { image: ImageQuestionResponse }) {


    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [drawing, setDrawing] = useState<boolean>(false);

    const [start, setStart] = useState({
        x: 0,
        y: 0
    });

    const [currentRectangle, setCurrentRectangle] = useState<Rectangle | null>(null);

    const [rectangles, setRectangles] = useState<Rectangle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const im = new Image();

        im.crossOrigin = "anonymous";

        im.onload = () => {
            ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
        };

        im.onerror = (error) => {
            console.error("Image failed to load:", error);
        };

        im.src = image.url;
    }, [image.url]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {

        if(e.button == 2 ){

            e.preventDefault();
            setRectangles(r=>r.slice(0,-1));

            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();

        // const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top;

        const x = e.clientX;
        const y = e.clientY ;

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

        setRectangles(prev => [
            ...prev,
            currentRectangle
        ]);

        setCurrentRectangle(null);
        setDrawing(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;

        const rect = e.currentTarget.getBoundingClientRect();


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
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-[50vw] h-auto border border-black"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onContextMenu={(e) => e.preventDefault()}

                />
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

            </div>

        </>
    )

}