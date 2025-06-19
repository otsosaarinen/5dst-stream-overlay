import ReconnectingWebSocket from "reconnecting-websocket";
import { useEffect, useState } from "react";
import { CountUp } from "countup.js";

function Gameplay() {
	// set match variables
	const [bestOf, setBestOf] = useState<number>(0);
	const firstTo: number = Math.ceil(bestOf / 2);

	const [beatmapSetId, setBeatmapSetId] = useState<string>("");
	const [beatmapArtist, setBeatmapArtist] = useState<string>("");
	const [beatmapTitle, setBeatmapTitle] = useState<string>("");
	const [beatmapDifficultyName, setBeatmapDifficultyName] =
		useState<string>("");
	const [beatmapMapper, setBeatmapMapper] = useState<string>("");
	const [beatmapSr, setBeatmapSr] = useState<number>();
	const [beatmapAr, setBeatmapAr] = useState<number>();
	const [beatmapCs, setBeatmapCs] = useState<number>();
	const [beatmapOd, setBeatmapOd] = useState<number>();
	const [beatmapBpm, setBeatmapBpm] = useState<number>();

	const [leftPlayer, setLeftPlayer] = useState<string>("");
	const [leftPlayerCountry, setLeftPlayerCountry] = useState<string>("");
	const [leftPlayerScore, setLeftPlayerScore] = useState<number>(0);
	const [leftPlayerPoints, setLeftPlayerPoints] = useState<number>(0);

	const [rightPlayer, setRightPlayer] = useState<string>("");
	const [rightPlayerCountry, setRightPlayerCountry] = useState<string>("");
	const [rightPlayerScore, setRightPlayerScore] = useState<number>(0);
	const [rightPlayerPoints, setRightPlayerPoints] = useState<number>(0);

	const [chatMessages, setChatMessages] = useState<string[]>([]);

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

			setBeatmapArtist(data.beatmap.artist);
			setBeatmapTitle(data.beatmap.title);
			setBeatmapDifficultyName(data.beatmap.version);
			setBeatmapMapper(data.beatmap.mapper);
			setBeatmapSr(data.beatmap.stats.stars.total);
			setBeatmapAr(data.beatmap.stats.ar.converted);
			setBeatmapCs(data.beatmap.stats.cs.converted);
			setBeatmapOd(data.beatmap.stats.od.converted);
			setBeatmapBpm(data.beatmap.stats.bpm.common);

			// only set these variables if clients exist
			if (data.tourney.clients.length > 0) {
				setLeftPlayer(data.tourney.clients[0].user.name);
				setLeftPlayerCountry(data.tourney.clients[0].user.country);
				setLeftPlayerScore(data.tourney.clients[0].play.score);
				setLeftPlayerPoints(data.tourney.points.left);

				setRightPlayer(data.tourney.clients[1].user.name);
				setRightPlayerCountry(data.tourney.clients[1].user.country);
				setRightPlayerScore(data.tourney.clients[1].play.score);
				setRightPlayerPoints(data.tourney.points.right);
			}
		};

		// Clean up on unmount
		return () => {
			socket.close();
		};
	}, []);

	return (
		<>
			<div className="font-figtree flex min-h-screen w-screen flex-col text-neutral-900">
				<div className="flex h-25 flex-row items-center justify-between bg-green-500">
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
				<div className="grow"></div>
				<div className="flex h-60 flex-row items-center justify-between bg-green-500">
					<div className="flex h-full items-end justify-start">
						<div
							className="relative h-40 w-2xl bg-cover bg-no-repeat text-white"
							style={{
								backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/cover.jpg)`,
							}}
						>
							<div className="absolute h-full w-full bg-black opacity-70"></div>
							<div className="relative flex flex-col p-2">
								<p className="text-2xl font-bold">
									{beatmapTitle} - {beatmapArtist} [
									{beatmapDifficultyName}] by {beatmapMapper}
								</p>
								<p className="text-xl">
									SR:{" "}
									<span className="text-2xl font-bold text-green-500 italic">
										{beatmapSr}
									</span>{" "}
									BPM:{" "}
									<span className="text-2xl font-bold text-green-500 italic">
										{beatmapBpm}
									</span>
								</p>
								<p className="text-xl">
									AR:{" "}
									<span className="text-2xl font-bold text-green-500 italic">
										{beatmapAr}
									</span>{" "}
									OD:{" "}
									<span className="text-2xl font-bold text-green-500 italic">
										{beatmapOd}
									</span>{" "}
									CS:{" "}
									<span className="text-2xl font-bold text-green-500 italic">
										{beatmapCs}
									</span>
								</p>
							</div>
						</div>
					</div>
					<div className="h-full">chat</div>
				</div>
			</div>
		</>
	);
}

export default Gameplay;
