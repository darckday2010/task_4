import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../queries";

interface BookingParams {
	roomId: string;
	guestName: string;
	checkIn: string;
	checkOut: string;
}

export const useBooking = (onSuccess: () => void) => {
	const [mutate, { loading }] = useMutation(CREATE_BOOKING, {
		onCompleted: () => onSuccess(),
		onError: (err) => alert(`Упс! Ошибка: ${err.message}`),
	});

	const makeBooking = ({ roomId, guestName, checkIn, checkOut }: BookingParams) => {
		if (!guestName.trim()) {
			alert("Пожалуйста, представьтесь! 🙃");
			return;
		}
		if (!checkIn || !checkOut) {
			alert("Выберите даты отпуска! 📅");
			return;
		}
		if (new Date(checkIn) >= new Date(checkOut)) {
			alert("Дата выезда должна быть позже даты заезда! ⏳");
			return;
		}

		mutate({ variables: { roomId, guestName, checkIn, checkOut } });
	};

	return { makeBooking, isBooking: loading };
};
