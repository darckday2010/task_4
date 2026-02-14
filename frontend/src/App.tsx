import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HotelListPage } from "./pages/HotelListPage";
import { Palmtree } from "lucide-react";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";

const App = () => {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-[#FFF7ED] font-sans text-slate-800">
				{/* Шапка (общая для всех страниц) */}
				<nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100/50">
					<div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
						<Link to="/" className="flex items-center gap-3 group hover:opacity-80 transition">
							<div className="bg-gradient-to-tr from-orange-400 to-pink-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-200">
								<Palmtree size={24} />
							</div>
							<div>
								<h1 className="text-xl font-black tracking-tight leading-none uppercase">
									Mini<span className="text-orange-500">Booking</span>
								</h1>
								<span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Travel App</span>
							</div>
						</Link>
					</div>
				</nav>

				{/* Контент меняется здесь */}
				<main className="max-w-7xl mx-auto px-6 py-12">
					<Routes>
						<Route path="/" element={<HotelListPage />} />
						<Route path="/hotel/:id" element={<HotelDetailsPage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
};

export default App;
