import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { useHotels } from "../api/hooks/useHotels"; // Используем наш хук!

export const HotelListPage = () => {
	// Хук сам загрузит данные и прогонит их через HotelMapper
	const { hotels, isLoading, error } = useHotels();

	if (isLoading) return <div className="text-center py-20 font-bold text-slate-400 animate-pulse">Ищем лучшие предложения... 🌴</div>;

	if (error) return <div className="text-center py-20 text-rose-500 font-bold">Ошибка: {error}</div>;

	return (
		<div className="space-y-8">
			<div className="text-center mb-12">
				<h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
					Куда поедем <span className="text-orange-500">отдыхать?</span>
				</h2>
				<p className="text-slate-500 text-lg">Выберите отель, чтобы посмотреть доступные номера</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{hotels.map((hotel) => (
					<div
						key={hotel.id}
						className="bg-white rounded-[2rem] p-8 shadow-xl shadow-orange-100/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white"
					>
						<h3 className="text-2xl font-black text-slate-800 mb-2">{hotel.name}</h3>
						<div className="flex items-center text-slate-500 font-medium mb-8 bg-slate-50 w-fit px-3 py-1 rounded-full text-sm">
							<MapPin size={16} className="text-orange-500 mr-2" />
							{hotel.location}
						</div>

						<Link
							to={`/hotel/${hotel.id}`}
							className="group flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-orange-500 transition-colors"
						>
							Выбрать номер
							<ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};
