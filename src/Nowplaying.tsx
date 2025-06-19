import { TosuWebSocket } from "./WebSocket";
import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import matchData from "./data/match.json";

function Nowplaying() {
	const [beatmapArtist, setBeatmapArtist] = useState<string>("");
	const [beatmapTitle, setBeatmapTitle] = useState<string>("");

	const [leftPlayer, setLeftPlayer] = useState<string>("");
	const [leftPlayerUserId, setLeftPlayerUserId] = useState<number>();

	const [rightPlayer, setRightPlayer] = useState<string>("");
	const [rightPlayerUserId, setRightPlayerUserId] = useState<number>();

	const [timeLeft, setTimeLeft] = useState<{
		minutes: number;
		seconds: number;
	} | null>(null);

	const data = TosuWebSocket();

	useEffect(() => {
		if (!data) {
			return;
		}

		setBeatmapArtist(data.beatmap.artist);
		setBeatmapTitle(data.beatmap.title);

		if (data.tourney.clients.length > 0) {
			setLeftPlayer(data.tourney.clients[0].user.name);
			setLeftPlayerUserId(data.tourney.clients[0].user.id);

			setRightPlayer(data.tourney.clients[1].user.name);
			setRightPlayerUserId(data.tourney.clients[1].user.id);
		}

		const timeNow = Date.now();
		const diff = matchData.match_time - timeNow;

		if (diff <= 0) {
			setTimeLeft({ minutes: 0, seconds: 0 });
			return;
		}

		const totalSeconds = Math.floor(diff / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		setTimeLeft({ minutes, seconds });
	}, [data]);
	return (
		<>
			<div className="font-figtree text-main flex h-screen w-screen flex-col items-center justify-center gap-10 bg-white text-xl">
				<div className="text-2xl">
					Starting in{" "}
					{timeLeft
						? `${timeLeft.minutes.toString()}:${timeLeft.seconds.toString()}`
						: "Loading..."}
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex flex-row items-center justify-center gap-2">
						<p>Now playing</p>
						<Music />
					</div>
					<div className="flex h-auto max-w-xl flex-row items-center justify-center gap-2 text-center text-2xl font-bold">
						<span>
							{beatmapTitle} - {beatmapArtist}
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

export default Nowplaying;
