import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_HOTEL } from "../api/queries";
import { RoomItem } from "../components/RoomItem";
import { HotelMapper } from "../api/mappers/hotelMapper"; // Импортируем маппер
import { ArrowLeft, MapPin, AlertCircle } from "lucide-react";
import type { IHotel } from "../api/domain/models";

export const HotelDetailsPage = () => {
	const { id } = useParams();

	// Получаем сырые данные (DTO)
	const { data, loading, error, refetch } = useQuery(GET_HOTEL, {
		variables: { id },
		fetchPolicy: "network-only",
	});

	if (loading)
		return (
			<div className="flex justify-center items-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);

	if (error) return <div className="text-center py-20 text-rose-500 font-bold">Ошибка: {error.message}</div>;

	// ТУТ МАГИЯ: Маппим данные, прежде чем использовать
	const hotel: IHotel | null = data?.hotel ? HotelMapper.toDomain(data.hotel) : null;

	if (!hotel) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
				<div className="bg-orange-100 p-4 rounded-full text-orange-500">
					<AlertCircle size={48} />
				</div>
				<h2 className="text-2xl font-black text-slate-800">Отель не найден</h2>
				<Link to="/" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
					Вернуться к списку
				</Link>
			</div>
		);
	}

	return (
		<div className="animate-fade-in-up">
			<Link
				to="/"
				className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold mb-8 px-4 py-2 rounded-xl hover:bg-orange-50 transition-all"
			>
				<ArrowLeft size={20} className="mr-2" /> Назад к отелям
			</Link>

			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-orange-100">
				<div>
					<h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">{hotel.name}</h1>
					<div className="flex items-center text-slate-500 font-medium bg-white px-3 py-1.5 rounded-full shadow-sm w-fit border border-slate-100">
						<MapPin size={18} className="text-orange-500 mr-2" /> {hotel.location}
					</div>
				</div>
				<div className="mt-6 md:mt-0 px-5 py-3 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 font-bold rounded-2xl border border-white shadow-sm">
					Номеров доступно: {hotel.rooms.length}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{hotel.rooms.map((room) => (
					<RoomItem key={room.id} room={room} onUpdate={refetch} />
				))}
			</div>
		</div>
	);
};
