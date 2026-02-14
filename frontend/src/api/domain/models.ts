export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface IBooking {
	id: string;
	guest: string;
	period: string;
	status: BookingStatus;
	isActive: boolean;
}

export interface IRoom {
	id: string;
	title: string;
	cost: string;
	image: string;
	bookings: IBooking[];
}

export interface IHotel {
	id: string;
	name: string;
	location: string;
	rooms: IRoom[];
}
