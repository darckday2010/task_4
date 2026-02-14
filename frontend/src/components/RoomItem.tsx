import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Clock, Trash2, ImageOff } from "lucide-react";
import type { IRoom, IBooking } from "../api/domain/models";
import { useBooking } from "../api/hooks/useBooking";
import { BookingModal } from "./BookingModal";
import { GET_HOTELS, GET_HOTEL } from "../api/queries";

const CANCEL_BOOKING = gql`
	mutation CancelBooking($id: ID!) {
		cancelBooking(id: $id) {
			id
			status
		}
	}
`;

interface Props {
	room: IRoom;
	onUpdate: () => void;
}

export const RoomItem = ({ room, onUpdate }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [cancelBooking, { loading: isCancelling }] = useMutation(CANCEL_BOOKING, {
		onCompleted: () => onUpdate(),
		refetchQueries: [
			{ query: GET_HOTELS },
			{ query: GET_HOTEL, variables: { id: room.id } }, // Обновляем и детали
		],
	});

	const { makeBooking, isBooking } = useBooking(() => {
		setIsModalOpen(false);
		onUpdate();
	});

	const activeBookings = room.bookings.filter((b) => b.status === "CONFIRMED");
	const isOccupied = activeBookings.length > 0;

	return (
		<div className="group bg-white rounded-[2rem] border border-slate-100 hover:border-orange-200 hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden">
			{/* 🖼️ КАРТИНКА С ЗАГЛУШКОЙ */}
			<div className="relative h-56 w-full bg-slate-100 overflow-hidden">
				{room.image ? (
					<img
						src={room.image}
						alt={room.title}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
						onError={(e) => {
							// Если ссылка битая, заменяем на пустой фон
							(e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
						}}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-slate-300">
						<ImageOff size={48} />
					</div>
				)}
				<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-xl font-black text-sm">
					{room.cost}
				</div>
			</div>

			<div className="p-6 flex flex-col flex-grow">
				<div className="mb-4">
					<h3 className="font-extrabold text-2xl text-slate-800">{room.title}</h3>
					<p className="text-slate-400 text-sm font-medium">Премиальный отдых</p>
				</div>

				<div className="flex-grow space-y-4 mb-6">
					{!isOccupied ? (
						<div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase">
							Свободен
						</div>
					) : (
						<div className="space-y-3">
							<div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-black uppercase">
								<Clock size={12} className="mr-2" /> Занят
							</div>
							{activeBookings.map((b: IBooking) => (
								<div
									key={b.id}
									className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
								>
									<div className="overflow-hidden">
										<div className="font-bold text-slate-700 text-xs truncate">{b.guest}</div>
										<div className="text-slate-400 text-[10px] font-medium">{b.period}</div>
									</div>
									<button
										onClick={() => window.confirm("Отменить?") && cancelBooking({ variables: { id: b.id } })}
										disabled={isCancelling}
										className="p-2 text-rose-300 hover:text-rose-600 transition-colors"
									>
										<Trash2 size={14} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<button
					onClick={() => setIsModalOpen(true)}
					className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all bg-slate-900 text-white hover:bg-orange-500 shadow-lg shadow-slate-200"
				>
					{isOccupied ? "Забронировать еще" : "Забронировать"}
				</button>
			</div>

			{isModalOpen && (
				<BookingModal
					roomTitle={room.title}
					price={room.cost}
					isLoading={isBooking}
					onClose={() => setIsModalOpen(false)}
					onSubmit={(data) => makeBooking({ roomId: room.id, ...data })}
				/>
			)}
		</div>
	);
};
