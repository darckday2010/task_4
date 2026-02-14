class BookingDto {
  final String id;
  final String checkIn;
  final String checkOut;
  final String
  guestName; // В API может не приходить в списке, но нужно для структуры
  final String status;

  BookingDto.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      checkIn = json['checkIn'],
      checkOut = json['checkOut'],
      guestName = json['guestName'] ?? '', // Заглушка, если поле не запросили
      status = json['status'];
}

class RoomDto {
  final String id;
  final String number;
  final double price; // GraphQL float = Dart double
  final String imageUrl;
  final List<BookingDto> bookings;

  RoomDto.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      number = json['number'],
      price = (json['price'] as num).toDouble(),
      imageUrl = json['imageUrl'],
      bookings = (json['bookings'] as List)
          .map((e) => BookingDto.fromJson(e))
          .toList();
}

class HotelDto {
  final String id;
  final String name;
  final String address;
  final List<RoomDto> rooms;

  HotelDto.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      name = json['name'],
      address = json['address'],
      rooms = (json['rooms'] as List).map((e) => RoomDto.fromJson(e)).toList();
}
