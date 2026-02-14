export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface BookingDTO {
	id: string;
	checkIn: string;
	checkOut: string;
	guestName: string;
	status: BookingStatus;
	isActive: boolean;
}

export interface RoomDTO {
	id: string;
	number: string;
	price: number;
	imageUrl: string;
	bookings: BookingDTO[];
}

export interface HotelDTO {
	id: string;
	name: string;
	address: string;
	rooms: RoomDTO[];
}
