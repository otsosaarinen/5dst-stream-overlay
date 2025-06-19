import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./Globals.css";
import Gameplay from "./Gameplay";
import Mappool from "./Mappool";
import Nowplaying from "./Nowplaying";
import Countdown from "./Countdown";
import Winner from "./Winner";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/gameplay" element={<Gameplay />} />
				<Route path="/mappool" element={<Mappool />} />
				<Route path="/Nowplaying" element={<Nowplaying />} />
				<Route path="/countdown" element={<Countdown />} />
				<Route path="/winner" element={<Winner />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
