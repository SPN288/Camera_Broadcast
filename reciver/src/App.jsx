import React, { useRef, useState, useEffect } from "react";

const Receiver = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [streamData, setStreamData] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:5000");

        ws.current.onopen = () => console.log("Connected to WebSocket");
        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log(message);
                if (message.type === "image") {
                    setImageSrc(message.data);
                    console.log("image r")
                } else if (message.type === "info") {
                    setStreamData(message.data);
                    console.log("Received Streaming Info:", message.data);
                }
            } catch (err) {
                console.error("❌ Error parsing message:", err);
            }
        };
        ws.current.onclose = () => console.log("WebSocket closed");

        return () => ws.current.close();
    }, []);

    return (
        <div>
            <h2>Live Camera Feed - Receiver</h2>
            {streamData ? (
                <div>
                    <p><strong>Streaming Data:</strong></p>
                    <p>ID: {streamData.id}</p>
                    <p>Latitude: {streamData.latitude}</p>
                    <p>Longitude: {streamData.longitude}</p>
                </div>
            ) : (
                <p><strong>Waiting for streaming data...</strong></p>
            )}
            {imageSrc ? (
                <img src={imageSrc} alt="Live Feed" width={400} height={300} />
            ) : (
                <p>Waiting for feed...</p>
            )}
        </div>
    );
};

export default Receiver;
