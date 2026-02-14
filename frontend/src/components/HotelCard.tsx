import type { IHotel } from "../api/domain/models";
import { RoomItem } from "./RoomItem";
import { MapPin } from "lucide-react";

interface Props {
	hotel: IHotel;
	onUpdate: () => void;
}

export const HotelCard = ({ hotel, onUpdate }: Props) => (
	<section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-white animate-fade-in-up mb-12">
		<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-slate-100 gap-4">
			<div>
				<h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">{hotel.name}</h2>
				<div className="flex items-center text-slate-500 font-medium bg-slate-50 w-fit px-4 py-2 rounded-full">
					<MapPin size={18} className="text-orange-500 mr-2" />
					{hotel.location}
				</div>
			</div>
			<div className="hidden md:block text-right">
				<div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Рейтинг</div>
				<div className="text-2xl font-black text-orange-500 flex items-center gap-1 justify-end">
					★★★★★ <span className="text-slate-300 text-lg">5.0</span>
				</div>
			</div>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{hotel.rooms.map((room) => (
				<RoomItem key={room.id} room={room} onUpdate={onUpdate} />
			))}
		</div>
	</section>
);
