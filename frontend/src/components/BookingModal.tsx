import { useState } from "react";
import { X, Calendar, User, CheckCircle } from "lucide-react";

interface Props {
	roomTitle: string;
	price: string;
	onClose: () => void;
	onSubmit: (data: { guestName: string; checkIn: string; checkOut: string }) => void;
	isLoading: boolean;
}

export const BookingModal = ({ roomTitle, price, onClose, onSubmit, isLoading }: Props) => {
	const [guestName, setGuestName] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in-up">
			<div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
				{/* Шапка: Градиент */}
				<div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-white relative">
					<button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition">
						<X size={20} />
					</button>
					<h3 className="text-2xl font-black uppercase tracking-wide">Бронирование</h3>
					<p className="opacity-90 mt-1">
						{roomTitle} • <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">{price}</span>
					</p>
				</div>

				<div className="p-8 space-y-6">
					{/* Поле имени */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase">
							<User size={16} className="text-orange-500" /> Гость
						</label>
						<input
							type="text"
							value={guestName}
							onChange={(e) => setGuestName(e.target.value)}
							className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-400 focus:bg-white outline-none transition-all font-medium text-lg"
							placeholder="Ваше имя"
						/>
					</div>

					{/* Даты */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase">
								<Calendar size={16} className="text-orange-500" /> Заезд
							</label>
							<input
								type="date"
								value={checkIn}
								onChange={(e) => setCheckIn(e.target.value)}
								className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-400 outline-none transition-all"
							/>
						</div>
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase">
								<Calendar size={16} className="text-pink-500" /> Выезд
							</label>
							<input
								type="date"
								value={checkOut}
								onChange={(e) => setCheckOut(e.target.value)}
								className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500 outline-none transition-all"
							/>
						</div>
					</div>
				</div>

				{/* Футер */}
				<div className="p-6 bg-slate-50 flex gap-4">
					<button
						onClick={onClose}
						className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-2xl transition-all"
					>
						Отмена
					</button>
					<button
						onClick={() => onSubmit({ guestName, checkIn, checkOut })}
						disabled={isLoading}
						className="flex-[2] py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							"Оформляем..."
						) : (
							<>
								<CheckCircle size={20} /> Подтвердить
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};
