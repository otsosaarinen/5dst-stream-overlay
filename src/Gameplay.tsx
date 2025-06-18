import ReconnectingWebSocket from "reconnecting-websocket";
import { useEffect, useState } from "react";
import { CountUp } from "countup.js";

function Gameplay() {
	// set match variables
	const [bestOf, setBestOf] = useState<number>(0);
	const firstTo: number = Math.ceil(bestOf / 2);
	const [chatMessages, setChatMessages] = useState<string[]>([]);
	const [beatmapSetId, setBeatmapSetId] = useState<string>("");

	const [leftPlayer, setLeftPlayer] = useState<string>("");
	const [leftPlayerCountry, setLeftPlayerCountry] = useState<string>("");
	const [leftPlayerScore, setLeftPlayerScore] = useState<number>(0);
	const [leftPlayerPoints, setLeftPlayerPoints] = useState<number>(0);

	const [rightPlayer, setRightPlayer] = useState<string>("");
	const [rightPlayerCountry, setRightPlayerCountry] = useState<string>("");
	const [rightPlayerScore, setRightPlayerScore] = useState<number>(0);
	const [rightPlayerPoints, setRightPlayerPoints] = useState<number>(0);

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

			setBestOf(data.tourney.bestOF);
			setBeatmapSetId(data.beatmap.set);

			setLeftPlayer(data.tourney.clients[0].user.name);
			setLeftPlayerCountry(data.tourney.clients[0].user.country);
			setLeftPlayerScore(data.tourney.clients[0].play.score);
			setLeftPlayerPoints(data.tourney.points.left);

			setRightPlayer(data.tourney.clients[1].user.name);
			setRightPlayerCountry(data.tourney.clients[1].user.country);
			setRightPlayerScore(data.tourney.clients[1].play.score);
			setRightPlayerPoints(data.tourney.points.right);
		};

		// Clean up on unmount
		return () => {
			socket.close();
		};
	}, []);

	return (
		<>
			<div className="font-figtree flex min-h-screen w-screen flex-col bg-amber-200 text-neutral-900">
				<div className="flex flex-row items-start justify-between bg-green-200">
					<div className="ml-5 text-left">
						<p className="text-3xl font-semibold">{leftPlayer}</p>
						<p className="text-xl">{leftPlayerCountry}</p>
						<p className="text-xl">{leftPlayerScore}</p>
						<div className="flex flex-row gap-2">
							{Array.from({ length: firstTo }).map((_, index) => (
								<div
									key={index}
									className="border-3 border-neutral-900 p-3"
								></div>
							))}
						</div>
					</div>
					<div className="text-7xl font-bold">5DST4</div>
					<div className="mr-5 text-right">
						<p className="text-3xl font-semibold">{rightPlayer}</p>
						<p className="text-xl">{rightPlayerCountry}</p>
						<p className="text-xl">{rightPlayerScore}</p>
						<div className="flex flex-row gap-2">
							{Array.from({ length: firstTo }).map((_, index) => (
								<div
									key={index}
									className="border-3 border-neutral-900 p-3"
								></div>
							))}
						</div>
					</div>
				</div>
				<div className="h-150 bg-red-200"></div>
				<div className="flex grow flex-row items-center justify-between bg-blue-200">
					<div className="h-full w-100">
						<img
							src={`https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/cover.jpg`}
							alt=""
						/>
					</div>
					<div>chat</div>
				</div>
			</div>
		</>
	);
}

export default Gameplay;
