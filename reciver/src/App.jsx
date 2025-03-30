import React, { useRef, useState, useEffect } from "react";

const Receiver = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:5000");

        ws.current.onopen = () => console.log("Connected to WebSocket");
        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "image") {
                    console.log("Received Image:", message.data.slice(0, 30) + "...");
                    setImageSrc(message.data);
                }
            } catch (err) {
                console.error("Error parsing message:", err);
            }
        };
        ws.current.onclose = () => console.log("WebSocket closed");

        return () => ws.current.close();
    }, []);

    return (
        <div>
            <h2>Live Camera Feed - Receiver</h2>
            {imageSrc ? (
                <img src={imageSrc} alt="Live Feed" width={400} height={300} />
            ) : (
                <p>Waiting for feed...</p>
            )}
        </div>
    );
};

export default Receiver;
