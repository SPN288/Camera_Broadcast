import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";

const Sender = () => {
    const webcamRef = useRef(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:5000");

        ws.current.onopen = () => console.log("Connected to WebSocket");
        ws.current.onclose = () => console.log("Disconnected from WebSocket");

        return () => ws.current.close();
    }, []);

    useEffect(() => {
        const captureFrame = () => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: "image", data: imageSrc }));
                    console.log("Sent Image:", imageSrc.slice(0, 30) + "...");
                }
            }
        };

        const interval = setInterval(captureFrame, 100); // Send frame every 200ms
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Live Camera Feed - Sender</h2>
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                height={300}
                videoConstraints={{ facingMode: "user" }}
            />
        </div>
    );
};

export default Sender;
