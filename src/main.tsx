import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./Globals.css";
import Gameplay from "./Gameplay";
import Mappool from "./Mappool";
import Showcase from "./Showcase";
import Countdown from "./Countdown";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/gameplay" element={<Gameplay />} />
				<Route path="/mappool" element={<Mappool />} />
				<Route path="/showcase" element={<Showcase />} />
				<Route path="/countdown" element={<Countdown />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
