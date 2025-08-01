import { TosuWebSocket } from "./WebSocket";
import { useEffect, useState, useRef, useMemo } from "react";
import { CountUp } from "countup.js";

function Countdown() {
	// set match variables
	const [bestOf, setBestOf] = useState<number>(0);
	const firstTo = useMemo(() => Math.ceil(bestOf / 2), [bestOf]);

	const [beatmapSetId, setBeatmapSetId] = useState<string>("");
	const [beatmapArtist, setBeatmapArtist] = useState<string>("");
	const [beatmapTitle, setBeatmapTitle] = useState<string>("");
	const [beatmapDifficultyName, setBeatmapDifficultyName] =
		useState<string>("");
	const [beatmapMapper, setBeatmapMapper] = useState<string>("");
	const [beatmapLength, setBeatmapLength] = useState<string>("");
	const [beatmapSr, setBeatmapSr] = useState<number>();
	const [beatmapAr, setBeatmapAr] = useState<number>();
	const [beatmapCs, setBeatmapCs] = useState<number>();
	const [beatmapOd, setBeatmapOd] = useState<number>();
	const [beatmapBpm, setBeatmapBpm] = useState<number>();

	const [leftPlayer, setLeftPlayer] = useState<string>("");
	const [leftPlayerUserId, setLeftPlayerUserId] = useState<number>();
	const [leftPlayerCountry, setLeftPlayerCountry] = useState<string>("");
	const [leftPlayerScore, setLeftPlayerScore] = useState<number>(0);
	const [leftPlayerPoints, setLeftPlayerPoints] = useState<number>(0);

	const [rightPlayer, setRightPlayer] = useState<string>("");
	const [rightPlayerUserId, setRightPlayerUserId] = useState<number>();
	const [rightPlayerCountry, setRightPlayerCountry] = useState<string>("");
	const [rightPlayerScore, setRightPlayerScore] = useState<number>(0);
	const [rightPlayerPoints, setRightPlayerPoints] = useState<number>(0);

	const [chatMessages, setChatMessages] = useState<string[]>([]);

	// set CountUp references
	const leftScoreRef = useRef<HTMLSpanElement>(null);
	const rightScoreRef = useRef<HTMLSpanElement>(null);
	const leftCountUpRef = useRef<CountUp | null>(null);
	const rightCountUpRef = useRef<CountUp | null>(null);

	useEffect(() => {
		if (leftScoreRef.current && !leftCountUpRef.current) {
			leftCountUpRef.current = new CountUp(leftScoreRef.current, 0, {
				duration: 0.1,
				useEasing: false,
			});
			leftCountUpRef.current.start();
		}
		if (rightScoreRef.current && !rightCountUpRef.current) {
			rightCountUpRef.current = new CountUp(rightScoreRef.current, 0, {
				duration: 0.1,
				useEasing: false,
			});
			rightCountUpRef.current.start();
		}
	}, []);

	useEffect(() => {
		if (leftCountUpRef.current) {
			leftCountUpRef.current.update(leftPlayerScore);
		}
	}, [leftPlayerScore]);

	useEffect(() => {
		if (rightCountUpRef.current) {
			rightCountUpRef.current.update(rightPlayerScore);
		}
	}, [rightPlayerScore]);

	const data = TosuWebSocket();

	useEffect(() => {
		if (!data) {
			return;
		}

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

		// calculate beatmap length
		const firstObject = data.beatmap.time.firstObject;
		const lastObject = data.beatmap.time.lastObject;
		const seconds = Math.floor(((lastObject - firstObject) / 1000) % 60);
		const minutes = Math.floor((lastObject - firstObject) / 1000 / 60);
		setBeatmapLength(
			`${minutes.toString()}:${seconds.toString().padStart(2, "0")}`,
		);

		// only set these variables if clients exist
		if (data.tourney.clients.length > 0) {
			setLeftPlayer(data.tourney.clients[0].user.name);
			setLeftPlayerUserId(data.tourney.clients[0].user.id);
			setLeftPlayerCountry(data.tourney.clients[0].user.country);
			setLeftPlayerScore(data.tourney.clients[0].play.score);
			setLeftPlayerPoints(data.tourney.points.left);

			setRightPlayer(data.tourney.clients[1].user.name);
			setRightPlayerUserId(data.tourney.clients[1].user.id);
			setRightPlayerCountry(data.tourney.clients[1].user.country);
			setRightPlayerScore(data.tourney.clients[1].play.score);
			setRightPlayerPoints(data.tourney.points.right);
		}
	}, [data]);

	return (
		<>
			<div className="font-figtree text-text flex min-h-screen w-screen flex-col">
				<div className="bg-main flex h-30 flex-row items-center justify-between">
					<div className="ml-5 text-left">
						<p className="flex flex-row gap-2 text-3xl font-semibold">
							<img
								src={`https://a.ppy.sh/${leftPlayerUserId}`}
								alt=""
								className="h-10"
							/>
							<span>{leftPlayer}</span>
						</p>
						<p className="text-xl">{leftPlayerCountry}</p>

						<div className="flex flex-row gap-2">
							{Array.from({ length: firstTo }).map((_, index) => (
								<div
									key={index}
									className={`transform border-3 border-neutral-900 p-3 transition-all duration-300 ${
										index < leftPlayerPoints
											? "scale-110 bg-neutral-900"
											: "scale-100 bg-transparent"
									}`}
								></div>
							))}
						</div>
					</div>
					<div className="text-7xl font-bold">5DST4</div>
					<div className="mr-5 text-right">
						<p className="flex flex-row justify-end gap-2 text-3xl font-semibold">
							<span>{rightPlayer}</span>
							<img
								src={`https://a.ppy.sh/${rightPlayerUserId}`}
								alt=""
								className="h-10"
							/>
						</p>
						<p className="text-xl">{rightPlayerCountry}</p>

						<div className="flex flex-row-reverse gap-2">
							{Array.from({ length: firstTo }).map((_, index) => (
								<div
									key={index}
									className={`transform border-3 border-neutral-900 p-3 transition-all duration-300 ${
										index < rightPlayerPoints
											? "scale-110 bg-neutral-900"
											: "scale-100 bg-transparent"
									}`}
								></div>
							))}
						</div>
					</div>
				</div>
				<div className="grow"></div>
				<div className="bg-main flex h-60 flex-col items-center justify-between">
					<div className="flex h-full flex-row items-center justify-center gap-5 text-4xl font-extrabold">
						<div className="w-50 text-right">
							<span ref={leftScoreRef}>0</span>
						</div>
						<div className="w-50 text-left">
							<span ref={rightScoreRef}>0</span>
						</div>
					</div>
					<div className="flex w-full flex-row justify-between">
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
										{beatmapDifficultyName}] by{" "}
										{beatmapMapper}
									</p>
									<p className="text-xl">
										SR:{" "}
										<span className="text-main text-2xl font-bold italic">
											{beatmapSr}
										</span>{" "}
										BPM:{" "}
										<span className="text-main text-2xl font-bold italic">
											{beatmapBpm}
										</span>{" "}
										Length:{" "}
										<span className="text-main text-2xl font-bold italic">
											{beatmapLength}
										</span>
									</p>
									<p className="text-xl">
										AR:{" "}
										<span className="text-main text-2xl font-bold italic">
											{beatmapAr}
										</span>{" "}
										OD:{" "}
										<span className="text-main text-2xl font-bold italic">
											{beatmapOd}
										</span>{" "}
										CS:{" "}
										<span className="text-main text-2xl font-bold italic">
											{beatmapCs}
										</span>
									</p>
								</div>
							</div>
						</div>
						<div className="h-full">chat</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Countdown;
