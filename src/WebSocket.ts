import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export function TosuWebSocket() {
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		const socket = new ReconnectingWebSocket(
			"ws://localhost:24050/websocket/v2",
		);

		socket.onopen = () => console.log("WebSocket connected");
		socket.onclose = () => console.log("WebSocket disconnected");
		socket.onerror = (error) => console.error("WebSocket error:", error);

		socket.onmessage = (message) => {
			const parsed = JSON.parse(message.data);
			setData(parsed);
		};

		return () => socket.close();
	}, []);

	return data;
}
