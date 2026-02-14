class Booking {
  final String id;
  final String period;
  final String guest;
  final bool isActive;

  Booking({
    required this.id,
    required this.period,
    required this.guest,
    required this.isActive,
  });
}

class Room {
  final String id;
  final String title;
  final String formattedPrice;
  final String imageUrl;
  final List<Booking> bookings;

  Room({
    required this.id,
    required this.title,
    required this.formattedPrice,
    required this.imageUrl,
    required this.bookings,
  });
}

class Hotel {
  final String id;
  final String name;
  final String location;
  final List<Room> rooms;

  Hotel({
    required this.id,
    required this.name,
    required this.location,
    required this.rooms,
  });
}
