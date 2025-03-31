import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const Sender = () => {
    const webcamRef = useRef(null);
    const ws = useRef(null);
    const [streaming, setStreaming] = useState(false);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:5000");

        ws.current.onopen = () => console.log("Connected to WebSocket");
        ws.current.onclose = () => console.log("Disconnected from WebSocket");

        return () => ws.current.close();
    }, []);

    const startStreaming = () => {
        if (ws.current.readyState === WebSocket.OPEN) {
            // Get device location
            navigator.geolocation.getCurrentPosition((position) => {
                const data = {
                    id: Math.floor(Math.random() * 1000), // Random ID
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                ws.current.send(JSON.stringify({ type: "info", data }));
                console.log("Sent Initial Data:", data);
            });
        }
        setStreaming(true);
    };

    const stopStreaming = () => {
        setStreaming(false);
    };

    useEffect(() => {
        let interval;
        if (streaming) {
            interval = setInterval(() => {
                if (webcamRef.current) {
                    const imageSrc = webcamRef.current.getScreenshot();
                    if (imageSrc && ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({ type: "image", data: imageSrc }));
                        console.log("Sent Image:", imageSrc.slice(0, 30) + "...");
                    }
                }
            }, 200);
        }
        return () => clearInterval(interval);
    }, [streaming]);

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
            <br />
            <button onClick={streaming ? stopStreaming : startStreaming}>
                {streaming ? "Stop Streaming" : "Start Streaming"}
            </button>
        </div>
    );
};

export default Sender;
