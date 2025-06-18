import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

function Gameplay() {
	const [beatmapCurrentTime, setBeatmapCurrentTime] = useState<string>("");

	useEffect(() => {
		const socket = new ReconnectingWebSocket(
			"ws://localhost:24050/websocket/v2",
		);

		socket.onopen = () => {
			console.log("Websocket connection opened");
		};

		socket.onclose = () => {
			console.log("Websocket connection closed");
		};

		socket.onerror = (error) => {
			console.log("Error with websocket: ", error);
		};

		socket.onmessage = (message: MessageEvent) => {
			const data = JSON.parse(message.data);
			setBeatmapCurrentTime(data.beatmap.time.live);
		};

		// Clean up on unmount
		return () => {
			socket.close();
		};
	}, []);

	return (
		<>
			<div className="bg-green-400">Progress: {beatmapCurrentTime}</div>
		</>
	);
}

export default Gameplay;
