import '../core/dtos.dart';
import '../domain/models.dart';

class HotelMapper {
  static Hotel toDomain(HotelDto dto) {
    return Hotel(
      id: dto.id,
      name: dto.name,
      location: dto.address,
      rooms: dto.rooms.map(_mapRoom).toList(),
    );
  }

  static Room _mapRoom(RoomDto dto) {
    return Room(
      id: dto.id,
      title: 'Номер ${dto.number}',
      formattedPrice: '\$${dto.price.toStringAsFixed(0)}',
      imageUrl: dto.imageUrl,
      bookings: dto.bookings.map(_mapBooking).toList(),
    );
  }

  static Booking _mapBooking(BookingDto dto) {
    return Booking(
      id: dto.id,
      period: '${dto.checkIn} — ${dto.checkOut}',
      guest: dto.guestName,
      isActive: dto.status == 'CONFIRMED',
    );
  }

  static Room toDomainRoom(RoomDto dto) {
    return _mapRoom(dto);
  }
}
