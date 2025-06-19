import { TosuWebSocket } from "./WebSocket";
import { useEffect, useState } from "react";
import { Music } from "lucide-react";

function Nowplaying() {
	const [beatmapArtist, setBeatmapArtist] = useState<string>("");
	const [beatmapTitle, setBeatmapTitle] = useState<string>("");

	const [leftPlayer, setLeftPlayer] = useState<string>("");
	const [leftPlayerUserId, setLeftPlayerUserId] = useState<number>();

	const [rightPlayer, setRightPlayer] = useState<string>("");
	const [rightPlayerUserId, setRightPlayerUserId] = useState<number>();

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
	}, [data]);
	return (
		<>
			<div className="font-figtree text-main flex h-screen w-screen flex-col items-center justify-center gap-3 bg-white text-xl">
				<div className="flex flex-row items-center justify-center gap-2">
					<p>Now playing</p>
					<Music />
				</div>
				<div className="flex flex-row items-center justify-center gap-2 text-2xl font-bold">
					<span>
						{beatmapTitle} - {beatmapArtist}
					</span>
					<div></div>
				</div>
			</div>
		</>
	);
}

export default Nowplaying;
