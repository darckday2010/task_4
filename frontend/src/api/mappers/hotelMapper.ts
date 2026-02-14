import type { HotelDTO, RoomDTO, BookingDTO } from "../dto";
import type { IHotel, IRoom, IBooking } from "../domain/models";

export class HotelMapper {
	static toDomain(dto: HotelDTO): IHotel {
		return {
			id: dto.id,
			name: dto.name,
			location: dto.address,
			rooms: dto.rooms.map((r) => this.mapRoom(r)),
		};
	}

	private static mapRoom(dto: RoomDTO): IRoom {
		return {
			id: dto.id,
			title: `Номер ${dto.number}`,
			cost: `$${dto.price}`,
			image: dto.imageUrl,
			bookings: dto.bookings.map((b) => this.mapBooking(b)),
		};
	}

	private static mapBooking(dto: BookingDTO): IBooking {
		return {
			id: dto.id,
			period: `${dto.checkIn} — ${dto.checkOut}`,
			guest: dto.guestName,
			isActive: dto.status === "CONFIRMED",
			status: dto.status,
		};
	}
}
